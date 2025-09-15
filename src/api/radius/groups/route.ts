import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface PostRequestBody {
    groupname: string;
    attribute: string;
    op: string;
    value: string;
}


export async function GET() {
    try{
        const groups = await prisma.radgroupreply.findMany({
            select: {
                groupname: true,
                attribute: true,
                op: true,
                value: true,
            },
            distinct: ['groupname'],
            orderBy: {
                groupname: 'asc',
            }
        });

        return NextResponse.json({groups}, {status: 200});
    }catch (error: any) {
        return NextResponse.json({ message: 'Maaf terjadi kesalahan pada server',error: error.message }, { status: 500 });
    }
    
}