import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


// GET: /api/brands
export async function GET() {
  try {
    const brands = await prisma.brands.findMany();
    return NextResponse.json({ success: true, data: brands }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST: /api/brands
export async function POST(request) {
  try {
    const body = await request.json();
    const newBrand = await prisma.brand.create({
      data: { name: body.name },
    });
    return NextResponse.json({ success: true, data: newBrand }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}