import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";
// GET: /api/Products
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  try {
    // 1. Ambil URL & query parameter ?page=X&limit=Y
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "1", 10);
    const skip = (page - 1) * limit;

    const whereCondition = {
      name: {
        contains: query,
      },
    };
    // 2. Query data produk dan total count sekaligus
    const [products, totalProduct] = await prisma.$transaction([
      prisma.products.findMany({
        where: whereCondition,
        take: 50,
        skip: skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          images: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.products.count({
        where: whereCondition, // Hitung total data berdasarkan pencarian yang sama
      }),
    ]);

    // 3. Kembalikan response JSON
    return NextResponse.json({
      data: products,
      total: totalProduct,
      page: page,
      limit: limit,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data produk" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    // 1. UBAH INI: Tangkap data sebagai FormData, bukan JSON
    const formData = await request.formData();

    // 2. Ekstrak data teks menggunakan .get()
    const name = formData.get("name");
    const tag = formData.get("tag");
    const description = formData.get("description");
    const published = formData.get("published") === "true";
    const metaDescription = formData.get("metaDescription");
    const metaKeywords = formData.get("metaKeywords");
    const categorieId = formData.get("categorieId");
    const brandId = formData.get("brandId");

    // 3. Simpan produk ke database TERLEBIH DAHULU untuk mendapatkan ID baru
    const newProduct = await prisma.products.create({
      data: {
        name,
        tag,
        description,
        published,
        metaDescription,
        metaKeywords,
        categorieId: categorieId ? parseInt(categorieId) : null,
        brandId: brandId ? parseInt(brandId) : null,
      },
    });

    // 4. Siapkan direktori folder berdasarkan ID produk yang baru saja dibuat
    const uploadDir = path.join(
      process.cwd(),
      `public/images/item/${newProduct.id}`,
    );
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 5. Tangani upload file fisik
    const files = formData.getAll("images");
    const imageRecords = [];

    for (const file of files) {
      if (typeof file === "object" && file.name) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Buat nama file unik
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.name);
        const fileName = `${uniqueSuffix}${ext}`;

        const filePath = path.join(uploadDir, fileName);

        // Simpan file fisik ke folder
        fs.writeFileSync(filePath, buffer);

        // Siapkan data untuk dimasukkan ke tabel images
        imageRecords.push({
          name: fileName,
          productId: newProduct.id,
        });
      }
    }

    // 6. Jika ada gambar, simpan nama gambarnya ke tabel relasi 'images'
    if (imageRecords.length > 0) {
      await prisma.images.createMany({
        data: imageRecords,
      });
    }

    return NextResponse.json(
      { message: "Produk berhasil dibuat", data: newProduct },
      { status: 201 },
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 },
    );
  }
}
