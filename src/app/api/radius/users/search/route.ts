import { NextRequest,NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req:NextRequest) {

    try{
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q');

        if (!query) {
            return NextResponse.json({ users: []}, { status: 400 });
        }

        const users = await prisma.radusergroup.findMany({
            where: {
                username: {
                    contains: query,
                    // mode: 'insensitive',
                }
            },
            select: {
                username: true,
                groupname: true
            },
            distinct: ['username'],
            orderBy: {
                username: 'asc',
            },
            take: 10
        });

        return NextResponse.json({users}, {status: 200});
    }catch (error: any) {
        return NextResponse.json({ message: 'Gagal Melakukan Pencarian User',error: error.message }, { status: 500 });
    }
    
}