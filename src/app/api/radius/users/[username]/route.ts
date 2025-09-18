import * as crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Fungsi GET Anda sudah bagus, tidak ada perubahan
export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    const [checkAttributes, userGroup, userInfo] = await Promise.all([
      prisma.radcheck.findMany({ where: { username }, select: { attribute: true, op: true, value: true } }),
      prisma.radusergroup.findFirst({ where: { username }, select: { groupname: true } }),
      prisma.userinfo.findUnique({ where: { username }, select: { fullName: true, department: true } }),
    ]);

    if (checkAttributes.length === 0) {
      return NextResponse.json({ message: `User '${username}' tidak ditemukan.` }, { status: 404 });
    }

    const userData = {
      username,
      group: userGroup?.groupname || "Tidak terdaftar di grup",
      fullName: userInfo?.fullName || "N/A",
      department: userInfo?.department || "N/A",
      checkAttributes: checkAttributes.map((attr) => ({
        ...attr,
        value: attr.attribute.toLowerCase().includes("password") ? "********" : attr.value,
      })),
    };
    return NextResponse.json(userData, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Maaf terjadi kesalahan pada server", error: error.message }, { status: 500 });
  }
}

// Interface baru untuk body request PUT yang lebih fleksibel
interface UpdateRequestBody {
  newPassword?: string;
  passwordType?: 'md5' | 'sha1' | 'cleartext';
  groupname?: string;
  fullName?: string;
  department?: string;
}

/**
 * Mengubah data user (password, grup, atau info)
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    const body: UpdateRequestBody = await req.json();

    if (Object.keys(body).length === 0) {
      return NextResponse.json({ message: "Body request tidak boleh kosong" }, { status: 400 });
    }

    const prismaOperations: Prisma.PrismaPromise<any>[] = [];

    // Logika untuk mengubah password (jika ada)
    if (body.newPassword) {
      let attribute = 'Cleartext-Password';
      let hashedPassword = body.newPassword;
      const passwordType = body.passwordType || 'cleartext';

      switch (passwordType) {
        case 'md5':
          attribute = 'MD5-Password';
          hashedPassword = crypto.createHash('md5').update(body.newPassword).digest('hex');
          break;
        case 'sha1':
          attribute = 'SHA1-Password';
          hashedPassword = crypto.createHash('sha1').update(body.newPassword).digest('hex');
          break;
      }
      // Hapus password lama apapun tipenya, lalu buat yang baru
      prismaOperations.push(prisma.radcheck.deleteMany({ where: { username, attribute: { contains: 'Password' } } }));
      prismaOperations.push(prisma.radcheck.create({ data: { username, attribute, op: ':=', value: hashedPassword } }));
    }

    // Logika untuk mengubah grup (jika ada)
    if (body.groupname) {
      // Validasi grup baru
      const groupExists = await prisma.radgroupreply.findFirst({ where: { groupname: body.groupname } });
      if (!groupExists) {
        return NextResponse.json({ message: `Grup '${body.groupname}' tidak ditemukan` }, { status: 400 });
      }
      prismaOperations.push(prisma.radusergroup.updateMany({ where: { username }, data: { groupname: body.groupname } }));
    }
    
    // Logika untuk mengubah fullName atau department (jika ada)
    if (body.fullName || body.department) {
      prismaOperations.push(prisma.userinfo.upsert({
        where: { username },
        update: {
          fullName: body.fullName,
          department: body.department,
        },
        create: {
          username,
          fullName: body.fullName || "N/A",
          department: body.department || "N/A",
        }
      }));
    }

    await prisma.$transaction(prismaOperations);

    return NextResponse.json({ message: `Data untuk user ${username} berhasil diubah` }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Maaf terjadi kesalahan pada server", error: error.message }, { status: 500 });
  }
}


// Fungsi DELETE Anda sudah bagus, tidak ada perubahan
export async function DELETE(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    const result = await prisma.$transaction([
      prisma.radcheck.deleteMany({ where: { username } }),
      prisma.radusergroup.deleteMany({ where: { username } }),
      prisma.userinfo.deleteMany({ where: { username } }),
    ]);

    if (result[0].count === 0) {
      return NextResponse.json({ message: `User '${username}' tidak ditemukan.` }, { status: 404 });
    }
    return NextResponse.json({ message: `User ${username} berhasil dihapus dari semua tabel` }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Maaf terjadi kesalahan pada server", error: error.message }, { status: 500 });
  }
}