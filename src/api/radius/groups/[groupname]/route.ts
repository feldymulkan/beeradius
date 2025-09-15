import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    context:{params: Promise<{ groupname: string }>}
){
    try{
        const { groupname } = await context.params;
        const checkGroup = await prisma.radgroupreply.findMany({
            where: { groupname },
            select: { 
                groupname: true, 
                attribute: true, 
                op: true, 
                value: true },
        });

        if (checkGroup.length === 0) {
            return NextResponse.json(
                { message: `Group '${groupname}' tidak ditemukan.` },
                { status: 404 }
            );
        }
        return NextResponse.json({checkGroup}, {status: 200});
    }catch (error: any) {
        return NextResponse.json({ message: 'Maaf terjadi kesalahan pada server',error: error.message }, { status: 500 });
    }
    
}