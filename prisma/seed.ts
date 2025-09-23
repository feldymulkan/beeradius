import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    const username = "admin";
    const plainPassword = "admin";

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const admin = await prisma.admin.upsert({
        where: { username: username },
        update: {
            password: hashedPassword
        },
        create: {
            username: username,
            password: hashedPassword,
        },
    });
    console.log(`Username ${admin.username} was created`);
}

main()
    .catch((e) => {
        console.error("Terjadi kesalahan:", e );
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    })
