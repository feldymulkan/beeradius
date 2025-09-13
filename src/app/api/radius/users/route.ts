import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface PostRequestBody {
    username: string;
    password: string;
    groupname?: string;
}



export async function POST(req: NextRequest) {

    try{
        const { username, password, groupname } = await req.json() as PostRequestBody;
        if (!username || !password) {
            return NextResponse.json({ message: 'Username dan password harus diisi' }, { status: 400 });
        }

        const userExists = await prisma.radcheck.findFirst({
            where: {
                username: username
            }
        })

        if (userExists) {
            return NextResponse.json({ message: 'User sudah ada' }, { status: 400 });
        }
        
        const assignedGroup = groupname || "default";
        const groupExists = await prisma.radgroupreply.findFirst({
            where: {
                groupname: assignedGroup
            }
        })

        if (!groupExists) {
            return NextResponse.json({ message: 'Group tidak ditemukan' }, { status: 400 });
        }

        const result = await prisma.$transaction([
            prisma.radcheck.create({
                data: {
                    username: username,
                    attribute: 'Cleartext-Password',
                    op: ':=',
                    value: password,
                },
            }), 
            prisma.radusergroup.create({
                data: {
                    username: username,
                    groupname: assignedGroup,
                },
            }),
        ]);
        return NextResponse.json({message: 'User berhasil dibuat',result}, {status: 200});
    
    } catch (error: any) {
        return NextResponse.json({ message: 'Maaf terjadi kesalahan pada server',error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try{
        const users = await prisma.radusergroup.findMany({
            select: {
                username: true,
                groupname: true
            },
            distinct: ['username'],
            orderBy: {
                username: 'asc',
            }
        });

        return NextResponse.json({users}, {status: 200});
    }catch (error: any) {
        return NextResponse.json({ message: 'Maaf terjadi kesalahan pada server',error: error.message }, { status: 500 });
    }
    
}