import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function GET(request,{ params }) {
  try {
    // 1. Ambil ID dari URL parameter dan ubah ke tipe Number/Int
    const {id} = await params
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'ID Produk tidak valid' },
        { status: 400 }
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
        { error: 'Produk tidak ditemukan' },
        { status: 404 }
      );
    }

    // 4. Kembalikan data produk
    return NextResponse.json({
      data: product,
    });
  } catch (error) {
    console.error('Error fetching product detail:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil detail produk' },
      { status: 500 }
    );
  }
}