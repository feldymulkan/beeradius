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

export async function POST(request:NextRequest) {
    try{
        const body = await request.json();
        const {groupname, attributes} = body;

        if (!groupname || !attributes || !Array.isArray(attributes) || attributes.length === 0) {
            return NextResponse.json({ message: 'Data tidak lengkap' }, { status: 400 });
        }

        const existingGroup = await prisma.radgroupreply.findFirst({ where: { groupname } });
        if (existingGroup) {
            return NextResponse.json({ message: `Grup '{groupname}' sudah ada` }, { status: 409 });
        }

        const dataToCreate = attributes.map((attribute: PostRequestBody) => ({
            groupname,
            attribute: attribute.attribute,
            op: attribute.op,
            value: attribute.value,
        }));

        await prisma.radgroupreply.createMany({ data: dataToCreate });
        return NextResponse.json({ message: 'Group berhasil disimpan' }, { status: 201 });


    }catch(error: unknown){
        let errorMessage = 'Maaf terjadi kesalahan pada server';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ message: "Gagal Membuat Group: ", errorMessage }, { status: 500 });
    }
    
}