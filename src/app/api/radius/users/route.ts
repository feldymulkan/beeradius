import * as crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Interface untuk body request yang mendukung semua field
interface PostRequestBody {
    username: string;
    password: string;
    groupname?: string;
    fullName?: string;
    department?: string;
    passwordType?: 'md5' | 'sha1' | 'cleartext';
}

/**
 * Membuat user baru dengan tipe password yang bisa dipilih
 */
export async function POST(req: NextRequest) {
    try {
        const { username, password, groupname, fullName, department, passwordType }: PostRequestBody = await req.json();

        if (!username || !password) {
            return NextResponse.json({ message: 'Username dan password harus diisi' }, { status: 400 });
        }

        const userExists = await prisma.radcheck.findFirst({
            where: { username: username }
        });
        if (userExists) {
            return NextResponse.json({ message: `Username '${username}' sudah digunakan.` }, { status: 409 });
        }
        
        const assignedGroup = groupname || "default";
        const groupExists = await prisma.radgroupreply.findFirst({
            where: { groupname: assignedGroup }
        });
        if (!groupExists) {
            return NextResponse.json({ message: `Grup '${assignedGroup}' tidak ditemukan` }, { status: 400 });
        }

        // Logika untuk hashing password berdasarkan pilihan
        let attribute = 'Cleartext-Password';
        let hashedPassword = password;

        switch (passwordType) {
            case 'md5':
                attribute = 'MD5-Password';
                hashedPassword = crypto.createHash('md5').update(password).digest('hex');
                break;
            case 'sha1':
                attribute = 'SHA1-Password';
                hashedPassword = crypto.createHash('sha1').update(password).digest('hex');
                break;
        }

        // Siapkan semua operasi dalam satu array untuk transaksi
        const prismaOperations: Prisma.PrismaPromise<any>[] = [
            prisma.radcheck.create({
                data: { 
                    username, 
                    attribute: attribute,
                    op: ':=', 
                    value: hashedPassword
                },
            }), 
            prisma.radusergroup.create({
                data: { username, groupname: assignedGroup },
            }),
        ];

        if (fullName || department) {
            prismaOperations.push(
                prisma.userinfo.create({
                    data: {
                        username,
                        fullName: fullName, 
                        department: department,
                    }
                })
            );
        }

        const transactionResult = await prisma.$transaction(prismaOperations);
        
        return NextResponse.json({ message: `User berhasil dibuat di grup ${assignedGroup}`, result: transactionResult }, { status: 201 });
    
    } catch (error: any) {
        return NextResponse.json({ message: 'Maaf terjadi kesalahan pada server', error: error.message }, { status: 500 });
    }
}

/**
 * Melihat semua user atau mencari user (termasuk data UserInfo)
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q');
        let baseUsers;

        if (query) {
            baseUsers = await prisma.radusergroup.findMany({
                where: { username: { contains: query } },
                select: { username: true, groupname: true },
                orderBy: { username: 'asc' },
                take: 20
            });
        } else {
            baseUsers = await prisma.radusergroup.findMany({
                select: { username: true, groupname: true },
                distinct: ['username'],
                orderBy: { username: 'asc' }
            });
        }

        if (baseUsers.length === 0) {
            return NextResponse.json({ users: [] }, { status: 200 });
        }

        const usernames = baseUsers.map(user => user.username);
        const userInfoList = await prisma.userinfo.findMany({
            where: { username: { in: usernames } }
        });

        const userInfoMap = new Map(userInfoList.map(info => [info.username, {
            fullName: info.fullName,
            department: info.department
        }]));

        const combinedUsers = baseUsers.map(user => ({
            ...user,
            fullName: userInfoMap.get(user.username)?.fullName || null,
            department: userInfoMap.get(user.username)?.department || null,
        }));

        return NextResponse.json({ users: combinedUsers }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Maaf terjadi kesalahan pada server', error: error.message }, { status: 500 });
    }
}