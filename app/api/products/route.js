import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


// GET: /api/Products
export async function GET(request) {
  try {
    // 1. Ambil URL & query parameter ?page=X&limit=Y
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "1", 10);

    // Hitung offset skip
    const skip = (page - 1) * limit;

    // 2. Query data produk dan total count sekaligus
    const [products, totalProduct] = await prisma.$transaction([
      prisma.products.findMany({
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
      prisma.products.count(),
    ]);

    // 3. Kembalikan response JSON
    return NextResponse.json({
      data: products,
      total: totalProduct,
      page: page,
      limit: limit,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data produk' },
      { status: 500 }
    );
  }
}
