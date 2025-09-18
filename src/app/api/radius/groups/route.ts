import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface PostRequestBody {
    groupname: string;
    attribute: string;
    op: string;
    value: string;
}


export async function GET(req: NextRequest) {
    try{
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q');

        let groups;
        if (query) {
            groups = await prisma.radgroupreply.findMany({
                where: {
                    groupname: {
                        contains: query,
                    },
                },
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
            })
        }else{
            groups = await prisma.radgroupreply.findMany({
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
        }

        return NextResponse.json({groups}, {status: 200});
    }catch (error: any) {
        return NextResponse.json({ message: 'Maaf terjadi kesalahan pada server',error: error.message }, { status: 500 });
    }
    
}