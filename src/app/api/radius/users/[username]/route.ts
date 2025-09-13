import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Melihat Detail User Spesifik
 */
export async function GET(
  context: { params: Promise<{ username: string }> }
) {
  try {
    // Harus await dulu
    const { username } = await context.params;

    const checkAttributes = await prisma.radcheck.findMany({
      where: { username },
      select: { attribute: true, op: true, value: true },
    });

    if (checkAttributes.length === 0) {
      return NextResponse.json(
        { message: `User '${username}' tidak ditemukan.` },
        { status: 404 }
      );
    }

    const userGroup = await prisma.radusergroup.findFirst({
      where: { username },
      select: { groupname: true },
    });

    const userData = {
      username,
      group: userGroup?.groupname || "Tidak terdaftar di grup",
      checkAttributes: checkAttributes.map((attr) => ({
        ...attr,
        value: attr.attribute.toLowerCase().includes("password")
          ? "********"
          : attr.value,
      })),
    };

    return NextResponse.json(userData, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Maaf terjadi kesalahan pada server", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const { newPassword }: { newPassword: string } = await req.json();

    if (!newPassword) {
      return NextResponse.json(
        { message: "Password baru diperlukan" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.radcheck.updateMany({
      where: {
        username,
        attribute: "Cleartext-Password",
      },
      data: {
        value: newPassword,
      },
    });

    if (updatedUser.count === 0) {
      return NextResponse.json(
        { message: "User tidak ditemukan atau password tidak dapat diubah" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: `Password untuk user ${username} berhasil diubah` },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Maaf terjadi kesalahan pada server", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const result = await prisma.$transaction([
      prisma.radcheck.deleteMany({ where: { username } }),
      prisma.radusergroup.deleteMany({ where: { username } }),
    ]);

    if (result[0].count === 0) {
      return NextResponse.json(
        { message: `User '${username}' tidak ditemukan.` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: `User ${username} berhasil dihapus` },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Maaf terjadi kesalahan pada server", error: error.message },
      { status: 500 }
    );
  }
}

