import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    _request: NextRequest,
    context: { params: Promise<{ groupname: string }> }
) {
    try {
        const params = await context.params;
        const groupname = decodeURIComponent(params.groupname).trim();

        const [replyAttributes, checkAttributes] = await Promise.all([
            prisma.radgroupreply.findMany({ where: { groupname } }),
            prisma.radgroupcheck.findMany({ where: { groupname } }),
        ]);

        // Jika grup tidak ada di mana pun, kembalikan 404
        if (replyAttributes.length === 0 && checkAttributes.length === 0) {
            return NextResponse.json(
                { message: `Grup '${groupname}' tidak ditemukan.` },
                { status: 404 }
            );
        }

        // Kembalikan hanya atribut 'reply' karena form edit saat ini hanya mengelola itu
        return NextResponse.json(replyAttributes, { status: 200 });

    } catch (error: unknown) {
        let errorMessage = "Terjadi kesalahan pada server.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        console.error("[API GET Group Error]:", errorMessage);
        return NextResponse.json(
            { message: "Gagal mengambil data grup.", error: errorMessage },
            { status: 500 }
        );
    }
}

/**
 * [IMPROVED] Mengupdate sebuah grup, termasuk mengganti namanya.
 * Membersihkan atribut dari 'radgroupcheck' dan 'radgroupreply'
 * dan memperbarui relasi di 'radusergroup'.
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ groupname: string }> }
) {
  try {
    const params = await context.params;
    const oldGroupname = decodeURIComponent(params.groupname).trim();

    const body = await request.json();
    const { newGroupname, attributes } = body;

    if (!newGroupname || !attributes) {
        return NextResponse.json({ message: "Nama grup baru dan atribut harus ada." }, { status: 400 });
    }

    if (oldGroupname !== newGroupname) {
      const existingGroup = await prisma.radgroupreply.findFirst({
        where: { groupname: newGroupname },
      });
      if (existingGroup) {
        return NextResponse.json({ message: `Grup dengan nama '${newGroupname}' sudah ada.` }, { status: 409 });
      }
    }

    const newAttributesData = attributes.map((attr: { attribute: string; op: string; value: string }) => ({
      groupname: newGroupname,
      attribute: attr.attribute,
      op: attr.op,
      value: attr.value,
    }));

    await prisma.$transaction([
      // 1. Hapus semua atribut lama dari kedua tabel
      prisma.radgroupreply.deleteMany({ where: { groupname: oldGroupname } }),
      prisma.radgroupcheck.deleteMany({ where: { groupname: oldGroupname } }),

      // 2. Buat semua atribut baru (saat ini hanya untuk reply)
      prisma.radgroupreply.createMany({ data: newAttributesData }),

      // 3. Update nama grup di tabel user
      prisma.radusergroup.updateMany({
          where: { groupname: oldGroupname },
          data: { groupname: newGroupname }
      })
    ]);

    return NextResponse.json({ message: `Grup '${oldGroupname}' berhasil diupdate menjadi '${newGroupname}'.` }, { status: 200 });

  } catch (error: unknown) {
    let errorMessage = "Terjadi kesalahan pada server.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    console.error("[API PUT Group Error]:", errorMessage);
    return NextResponse.json({ message: "Gagal mengupdate grup.", error: errorMessage }, { status: 500 });
  }
}

/**
 * [IMPROVED] Menghapus grup dari semua tabel terkait.
 * Sekarang juga membersihkan data di 'radusergroup' untuk mencegah data yatim.
 */
export async function DELETE(
    _requests: NextRequest,
    context: { params: Promise<{ groupname: string }> }
){
    try {
        const params = await context.params;
        const groupname = decodeURIComponent(params.groupname).trim();

        const [replyResult, checkResult, userGroupResult] = await prisma.$transaction([
            prisma.radgroupreply.deleteMany({ where: { groupname } }),
            prisma.radgroupcheck.deleteMany({ where: { groupname } }),
            prisma.radusergroup.deleteMany({ where: { groupname } }), // <-- Termasuk radusergroup
        ]);

        const totalDeleted = replyResult.count + checkResult.count + userGroupResult.count;

        if(totalDeleted === 0){
            return NextResponse.json(
                { message: `Grup '${groupname}' tidak ditemukan.` },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: `Grup '${groupname}' berhasil dihapus dari semua tabel.` },
            { status: 200 }
        );

    } catch (error: unknown) {
        let errorMessage = "Terjadi kesalahan pada server.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        console.error("[API DELETE Group Error]:", errorMessage);
        return NextResponse.json(
            { message: "Gagal menghapus grup.", error: errorMessage },
            { status: 500 }
        );
    }
}