import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    const [employees, total] = await prisma.$transaction([
      prisma.employees.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { roleData: true }, // Menarik relasi nama role
      }),
      prisma.employees.count({
        where: whereCondition,
      }),
    ]);

    return NextResponse.json(
      { data: employees, total: total },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, role_id } = body;

    const newEmploye = await prisma.employees.create({
      data: {
        name,
        email,
        phone,
        role_id: role_id ? parseInt(role_id) : null,
      },
    });

    return NextResponse.json(
      { message: "Karyawan berhasil dibuat", data: newEmploye },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
