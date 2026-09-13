import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const employe = await prisma.employees.findUnique({
      where: { id: parseInt(id) },
      include: { roleData: true },
    });

    if (!employe)
      return NextResponse.json(
        { error: "Karyawan tidak ditemukan" },
        { status: 404 },
      );

    return NextResponse.json({ data: employe }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, email, phone, role_id } = body;

    const updatedEmploye = await prisma.employees.update({
      where: { id: parseInt(id) },
      data: {
        name,
        email,
        phone,
        role_id: role_id ? parseInt(role_id) : null,
      },
    });

    return NextResponse.json(
      { message: "Karyawan diperbarui", data: updatedEmploye },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    await prisma.employees.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: "Karyawan berhasil dihapus" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
