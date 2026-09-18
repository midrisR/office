"use server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";
import { productValidation } from "@/validation/productValidation";
import { log } from "console";

// GET ALL PRODUCTS
export async function getProducts({ page, limit, query }) {
  const skip = (page - 1) * limit;
  const whereCondition = {
    name: {
      contains: query,
    },
    published: true,
  };
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
  return { products, totalProduct };
}

// GET DETAIL PRODUCT
export async function getDetailProduct(id) {
  const data = await prisma.products.findUnique({
    where: {
      id: parseInt(id),
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

  if (!data) {
    return {
      title: "Produk Tidak Ditemukan",
      description: "Halaman produk yang Anda cari tidak tersedia.",
    };
  }
  return data;
}

// CREATE NEW PRODUCT
export async function createProducts(formData) {
  try {
    const name = formData.get("name");
    const tag = formData.get("tag");
    const description = formData.get("description");
    const published = formData.get("published") === "true";
    const metaDescription = formData.get("metaDescription");
    const metaKeywords = formData.get("metaKeywords");

    // Konversi ke Integer atau null agar sesuai dengan tipe data Joi & Prisma
    const categorieId = formData.get("categorieId");
    const brandId = formData.get("brandId");
    const rawFiles = formData.getAll("images");

    const imageFileData = rawFiles
      .filter((file) => typeof file === "object" && file.size > 0)
      .map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
      }));

    const body = {
      name,
      tag,
      description,
      metaDescription,
      metaKeywords,
      categorieId,
      brandId,
      images: imageFileData,
    };

    const { images, ...productData } = body;

    // 1. Validasi Joi
    const { error } = productValidation(body);
    if (error) {
      // Ubah error Joi menjadi object biasa agar bisa dikirim ke frontend
      const formattedErrors = {};
      error.details.forEach((detail) => {
        formattedErrors[detail.path[0]] = detail.message;
      });
      // Kembalikan format balasan yang seragam (success: false)

      return {
        success: false,
        message: "Validasi gagal",
        error: formattedErrors,
      };
    }

    // 2. Simpan produk ke database
    const product = await prisma.products.create({
      ...productData,
    });

    // 3. Siapkan direktori folder
    const uploadDir = path.join(
      process.cwd(),
      `public/images/item/${product.id}`,
    );
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 4. Tangani upload file fisik
    const files = formData.getAll("images");
    const imageRecords = [];

    for (const file of files) {
      if (typeof file === "object" && file.name) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.name);
        const fileName = `${uniqueSuffix}${ext}`;

        const filePath = path.join(uploadDir, fileName);

        fs.writeFileSync(filePath, buffer);

        imageRecords.push({
          name: fileName,
          productId: product.id,
        });
      }
    }

    // 5. Simpan nama gambar ke tabel relasi 'images'
    if (imageRecords.length > 0) {
      await prisma.images.createMany({
        data: imageRecords,
      });
    }

    return { success: true, message: "Produk berhasil dibuat", data: product };
  } catch (error) {
    console.error("Server Action Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan pada server",
      error: error.message,
    };
  }
}
// EDIT PRODUCT BY ID
export async function updateProductByID({ id, formData }) {
  // Ambil data teks
  try {
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
    const newProduct = await prisma.products.update({
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
            name: img.name,
          })),
        },
      },
    });

    return {
      message: "Produk berhasil diubah",
      success: true,
      data: newProduct,
    };
  } catch (error) {
    return {
      message: "Produk gagal diubah",
      error: error,
      success: false,
    };
  }
}

// DELETE PRODUCT BY ID
export async function deleteProductByID(id) {
  try {
    const productId = parseInt(id);
    // 1. Cek apakah produk ada di database, sekaligus ambil data gambarnya
    const existingProduct = await prisma.products.findUnique({
      where: { id: productId },
      include: { images: true }, // Sertakan relasi images
    });

    if (!existingProduct) {
      return { error: "Produk tidak ditemukan di database" };
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

    return {
      message: "Produk beserta semua gambarnya berhasil dihapus total!",
      seccess: true,
    };
  } catch (error) {
    return {
      error: "Internal Server Error",
      details: error.message,
      success: false,
    };
  }
}
