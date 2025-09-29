import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: { groupname: string } } // params langsung objek, bukan Promise
) {
  try {
    const { groupname } = params;

    const checkGroup = await prisma.radgroupreply.findMany({
      where: { groupname },
      select: {
        groupname: true,
        attribute: true,
        op: true,
        value: true,
      },
    });

    if (checkGroup.length === 0) {
      return NextResponse.json(
        { message: `Grup '${groupname}' tidak ditemukan.` },
        { status: 404 }
      );
    }

    return NextResponse.json({ checkGroup }, { status: 200 });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Maaf terjadi kesalahan pada server", error: error.message },
      { status: 500 }
    );
  }
}
