import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function GET(request, { params }) {
  try {
    // 1. Ambil ID dari URL parameter dan ubah ke tipe Number/Int
    const { id } = await params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "ID Produk tidak valid" },
        { status: 400 },
      );
    }

    // 2. Query ke database menggunakan findUnique
    const product = await prisma.products.findUnique({
      where: {
        id: productId,
      },
      include: {
        images: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // 3. Jika produk tidak ditemukan
    if (!product) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan" },
        { status: 404 },
      );
    }

    // 4. Kembalikan data produk
    return NextResponse.json({
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product detail:", error);
    return NextResponse.json(
      { error: "Gagal mengambil detail produk" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const formData = await request.formData();

    // Ambil data teks
    const name = formData.get("name");
    const tag = formData.get("tag");
    const description = formData.get("description");
    const published = formData.get("published") === "true";
    const metaDescription = formData.get("metaDescription");
    const metaKeywords = formData.get("metaKeywords");

    // Tentukan direktori folder tujuan: public/images/item/[id]
    const uploadDir = path.join(process.cwd(), `public/images/item/${id}`);

    // Buat foldernya secara otomatis jika belum ada
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Ambil file baru yang di-upload
    const newFiles = formData.getAll("newImages");
    const processedImages = [];

    // 1. Simpan file fisik baru ke folder public
    for (const file of newFiles) {
      if (typeof file === "object" && file.name) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Buat nama file unik untuk menghindari bentrok nama
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.name);
        const fileName = `${uniqueSuffix}${ext}`;

        const filePath = path.join(uploadDir, fileName);

        // Tulis file ke disk
        fs.writeFileSync(filePath, buffer);

        // Masukkan HANYA NAMA FILE-NYA saja ke array untuk database
        processedImages.push({ name: fileName });
      }
    }

    // 2. Tangani juga gambar lama yang ingin dipertahankan (jika ada sistemnya)
    const existingImagesUrl = formData.getAll("existingImages");

    existingImagesUrl.forEach((url) => {
      const fileName = path.basename(url); // Ambil nama file dari URL lama
      processedImages.push({ name: fileName });
    });

    // 3. Update database menggunakan Prisma & Nested Write
    const updatedProduct = await prisma.products.update({
      where: { id: parseInt(id) },
      data: {
        name,
        tag,
        description,
        published,
        metaDescription,
        metaKeywords,
        images: {
          create: processedImages.map((img) => ({
            name: img.name, // HANYA NAMA FILE YANG MASUK KE DATABASE
            // createdAt: new Date(),
            // updatedAt: new Date(),
          })),
        },
      },
    });

    return NextResponse.json(
      { message: "Sukses", data: updatedProduct },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const productId = parseInt(id);
    // 1. Cek apakah produk ada di database, sekaligus ambil data gambarnya
    const existingProduct = await prisma.products.findUnique({
      where: { id: productId },
      include: { images: true }, // Sertakan relasi images
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Produk tidak ditemukan di database" },
        { status: 404 },
      );
    }

    // 2. Hapus Folder Fisik beserta seluruh isi gambarnya di lokal
    // Path: public/images/item/[productId]
    const uploadDir = path.join(
      process.cwd(),
      `public/images/item/${productId}`,
    );

    // Mengecek apakah folder tersebut ada
    if (fs.existsSync(uploadDir)) {
      // Menghapus folder beserta seluruh file di dalamnya secara paksa (seperti rm -rf)
      fs.rmSync(uploadDir, { recursive: true, force: true });
      console.log(`Folder fisik produk ${productId} berhasil dihapus.`);
    }

    // 3. Hapus data produk dari Database
    // Catatan: Karena di schema Anda ada atribut @relation(..., onDelete: Cascade) pada tabel images,
    // maka ketika produk dihapus, baris data gambar yang terkait di tabel 'images' akan otomatis ikut terhapus!
    await prisma.products.delete({
      where: { id: productId },
    });

    return NextResponse.json(
      { message: "Produk beserta semua gambarnya berhasil dihapus total!" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Gagal menghapus produk:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 },
    );
  }
}
