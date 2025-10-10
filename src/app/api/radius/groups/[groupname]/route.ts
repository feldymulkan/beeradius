import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Mengambil detail atribut dari sebuah grup RADIUS
 */
export async function GET(
    _request: NextRequest,
    context: { params: Promise<{ groupname: string }> } // Perbaiki tipe di sini
) {
    try {
        // Gunakan await untuk mendapatkan params
        const params = await context.params;
        const { groupname } = params;

        // Ambil semua atribut balasan (reply attributes) untuk grup ini
        const groupAttributes = await prisma.radgroupreply.findMany({
            where: { groupname },
            select: { 
                groupname: true, 
                attribute: true, 
                op: true, 
                value: true 
            },
        });

        if (groupAttributes.length === 0) {
            return NextResponse.json(
                { message: `Grup '${groupname}' tidak ditemukan atau tidak memiliki atribut.` },
                { status: 404 }
            );
        }

        return NextResponse.json({ groupAttributes }, { status: 200 });

    } catch (error: unknown) {
        let errorMessage = "Terjadi kesalahan pada server.";
        if (error instanceof Error) { 
            errorMessage = error.message; 
        }
        console.error("GET Group Error:", errorMessage);
        return NextResponse.json(
            { message: "Gagal mengambil data grup.", error: errorMessage },
            { status: 500 }
        );
    }
}