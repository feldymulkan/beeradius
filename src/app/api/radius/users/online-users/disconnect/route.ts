import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { exec } from "child_process"; // Untuk menjalankan perintah terminal
import util from "util";

const execAsync = util.promisify(exec);

function sanitize(input: string): string {
  return input.replace(/[^a-zA-Z0-9_.-@]/g, '');
}

/**
 * POST /api/radius/users/disconnect
 * Menerima { username } dan mengirim Packet of Disconnect (PoD)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username } = body;

    if (!username) {
      return NextResponse.json(
        { message: "Username diperlukan." },
        { status: 400 }
      );
    }

    const cleanUsername = sanitize(username);

    // 1. Cari sesi aktif user di radacct
    const session = await prisma.radacct.findFirst({
      where: {
        username: cleanUsername,
        acctstoptime: null,
      },
      select: {
        nasipaddress: true,
      },
    });

    if (!session) {
      return NextResponse.json(
        { message: `User ${cleanUsername} tidak sedang online.` },
        { status: 404 }
      );
    }

    const cleanNasIp = sanitize(session.nasipaddress);

    // 2. [PERBAIKAN] Ganti 'findUnique' menjadi 'findFirst'
    // 'findFirst' bisa mencari berdasarkan kolom 'nasname'
    const nas = await prisma.nas.findFirst({
      where: {
        nasname: cleanNasIp, // 'nasname' biasanya diisi IP
      },
      select: {
        secret: true,
      },
    });

    if (!nas || !nas.secret) {
      return NextResponse.json(
        { message: `Router (NAS) dengan IP ${cleanNasIp} tidak ditemukan atau tidak memiliki secret.` },
        { status: 404 }
      );
    }

    const cleanNasSecret = sanitize(nas.secret);
    const podPort = 3799; // Port standar Packet of Disconnect

    // 3. Buat dan jalankan perintah radclient
    const commandPayload = `User-Name="${cleanUsername}"`;
    const command = `echo '${commandPayload}' | radclient -x ${cleanNasIp}:${podPort} disconnect ${cleanNasSecret}`;

    console.log(`[Disconnect] Menjalankan: ${command}`);

    const { stdout, stderr } = await execAsync(command);

    if (stderr) {
      console.error(`[radclient stderr]: ${stderr}`);
      return NextResponse.json(
        { message: "Error saat menjalankan radclient.", error: stderr },
        { status: 500 }
      );
    }

    // 4. Kirim balasan sukses
    return NextResponse.json(
      { message: `Permintaan disconnect untuk ${cleanUsername} terkirim.`, details: stdout },
      { status: 200 }
    );

  } catch (error) {
    console.error("[API Disconnect Error]:", error);
    // Penanganan error 'unknown' dari TypeScript
    if (error instanceof Error) {
       // Cek jika 'radclient' tidak ditemukan
       if (error.message.includes('ENOENT')) {
         return NextResponse.json(
            { message: "Server error: 'radclient' tidak ditemukan. Sudah diinstal (freeradius-utils)?" },
            { status: 500 }
          );
       }
       return NextResponse.json(
        { message: "Gagal memproses permintaan disconnect.", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Gagal memproses permintaan disconnect." },
      { status: 500 }
    );
  }
}