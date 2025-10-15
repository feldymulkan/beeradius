import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // Pastikan path ini benar
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * [FIXED] Mengambil data admin yang sedang login berdasarkan ID dari sesi.
 */
export async function GET() {
    const session = await getServerSession(authOptions);
    // 1. Pemeriksaan keamanan yang benar: cek berdasarkan ID, bukan email.
    if (!session?.user?.id) {
        return NextResponse.json({ message: "Tidak terautentikasi" }, { status: 401 });
    }

    try {
        // 2. Ubah ID dari string (sesi) menjadi number (database)
        const adminId = parseInt(session.user.id);

        const admin = await prisma.admin.findUnique({
            where: { id: adminId },
            select: { id: true, username: true }, // Hanya kirim data yang aman
        });

        if (!admin) {
            return NextResponse.json({ message: "Admin tidak ditemukan" }, { status: 404 });
        }

        return NextResponse.json(admin, { status: 200 });
    } catch (error) {
        console.error("[API GET Admin Settings Error]:", error);
        return NextResponse.json({ message: "Terjadi kesalahan pada server" }, { status: 500 });
    }
}

/**
 * [IMPROVED] Mengupdate profil (username) atau password admin.
 */
export async function PUT(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ message: "Tidak terautentikasi" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { username, currentPassword, newPassword } = body;
        const adminId = parseInt(session.user.id);

        const admin = await prisma.admin.findUnique({
            where: { id: adminId },
        });

        if (!admin) {
            return NextResponse.json({ message: "Admin tidak ditemukan" }, { status: 404 });
        }

        // --- Logika untuk ubah password ---
        if (currentPassword && newPassword) {
            const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
            if (!isPasswordValid) {
                return NextResponse.json({ message: "Password saat ini salah." }, { status: 400 });
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await prisma.admin.update({
                where: { id: adminId },
                data: { password: hashedPassword },
            });
            return NextResponse.json({ message: "Password berhasil diperbarui." }, { status: 200 });
        }

        // --- Logika untuk update profil (username) ---
        if (username) {
            // Cek apakah username baru sudah digunakan oleh admin lain
            if (username !== admin.username) {
                const existingAdmin = await prisma.admin.findUnique({ where: { username } });
                if (existingAdmin) {
                    return NextResponse.json({ message: "Username sudah digunakan." }, { status: 409 }); // 409 Conflict
                }
            }
            await prisma.admin.update({
                where: { id: adminId },
                data: { username },
            });
            return NextResponse.json({ message: "Profil berhasil diperbarui." }, { status: 200 });
        }

        return NextResponse.json({ message: "Tidak ada data untuk diupdate." }, { status: 400 });

    } catch (error) {
        console.error("[API PUT Admin Settings Error]:", error);
        return NextResponse.json({ message: "Gagal mengupdate pengaturan." }, { status: 500 });
    }
}