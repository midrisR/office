import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

// ==========================================
// 1. POST: Membuat Kategori & Upload Gambar
// ==========================================
export async function POST(request) {
  try {
    const formData = await request.formData();

    // Ambil data dari form
    const name = formData.get("name");
    const published = formData.get("published") === "true";
    const imageFile = formData.get("image"); // Hanya 1 file gambar

    // TAHAP 1: Insert ke database HANYA data teks untuk mendapatkan ID
    const newCategory = await prisma.categories.create({
      data: {
        name: name,
        published: published,
        // Wajib diisi manual karena schema Anda tidak memiliki @default(now())
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    let fileName = null;

    // TAHAP 2: Jika user mengupload gambar, buat folder dan simpan file
    if (imageFile && typeof imageFile === "object" && imageFile.name) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Buat nama file unik
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(imageFile.name);
      fileName = `${uniqueSuffix}${ext}`;

      // Buat folder fisik sesuai ID yang baru saja digenerate
      // Path: public/images/item-category/[id]
      const uploadDir = path.join(
        process.cwd(),
        `public/images/item-category/${newCategory.id}`,
      );

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Tulis file fisik ke dalam folder tersebut
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);

      // Update baris database tadi dengan memasukkan nama file gambar
      await prisma.categories.update({
        where: { id: newCategory.id },
        data: {
          image: fileName,
          updatedAt: new Date(), // Update waktu
        },
      });
    }

    // Ambil data final untuk dikembalikan ke frontend
    const finalCategory = await prisma.categories.findUnique({
      where: { id: newCategory.id },
    });

    return NextResponse.json(
      { message: "Kategori berhasil dibuat", data: finalCategory },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 },
    );
  }
}

// ==========================================
// 2. GET: Mengambil Data Kategori (dengan Search & Pagination)
// ==========================================
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const whereCondition = {
      name: { contains: query },
    };

    const [categories, total] = await prisma.$transaction([
      prisma.categories.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.categories.count({
        where: whereCondition,
      }),
    ]);

    return NextResponse.json(
      { data: categories, total: total },
      { status: 200 },
    );
  } catch (error) {
    console.error("Gagal mengambil data kategori:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
