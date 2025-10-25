import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface ReplyAttribute {

    attribute: string;
    op: string;
    value: string;
}

interface PostRequestBody{
    groupname: string;
    attributes: ReplyAttribute[];
    simultaneousUse?: string;
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
    let groupname: string = ''; 
    try{
        const body: PostRequestBody = await request.json();
        const { attributes, simultaneousUse } = body;
        groupname = body.groupname; 

        if (!groupname || !attributes || !Array.isArray(attributes) || attributes.length === 0) {
            return NextResponse.json({ message: 'Data tidak lengkap' }, { status: 400 });
        }

        const existingRadgroupReply = await prisma.radgroupreply.findFirst({ where: { groupname } });
        const existingRadgroupCheck = await prisma.radgroupcheck.findFirst({ where: {groupname}});

        if (existingRadgroupReply || existingRadgroupCheck) {
            return NextResponse.json({ message: `Grup '${groupname}' sudah ada` }, { status: 409 });
        }

        const replyDataToCreate = attributes.map((attribute: ReplyAttribute) => ({
            groupname,
            attribute: attribute.attribute,
            op: attribute.op,
            value: attribute.value,
        }));

        const operation =  [];

        operation.push(
            prisma.radgroupreply.createMany({ data: replyDataToCreate }),
        );

        if (simultaneousUse && simultaneousUse.trim() !== '') {
            operation.push(
                prisma.radgroupcheck.create({
                    data:{
                        groupname,
                        attribute: 'Simultaneous-Use',
                        op: ':=',
                        value: simultaneousUse,
                    }
                })
            )
        }

        await prisma.$transaction(operation);
        return NextResponse.json({ message: 'Group berhasil disimpan' }, { status: 201 });


    }catch(error: unknown){
        let errorMessage = 'Maaf terjadi kesalahan pada server';
        if (typeof error === 'object' && error !== null && 'code' in error) {
            if (error.code === 'P2002') {
                errorMessage = `Grup '${groupname || 'tersebut'}' sudah ada.`;
                return NextResponse.json({ message: "Gagal Membuat Group: ", errorMessage }, { status: 409 });
           }
        }
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ message: "Gagal Membuat Group: ", errorMessage }, { status: 500 });
    }
}