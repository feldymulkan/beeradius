import prisma from "@/lib/prisma";
import Link from "next/link";
// Ganti nama komponen ini jika nama file form edit Anda berbeda
import GroupDetailClientWrapper from "@/components/GroupDetailClientWrapper";
import { notFound } from "next/navigation";

export default async function GroupDetailPage({
  params,
}: {
  // [PERBAIKAN] Ini adalah cara standar
  // untuk menerima params di Next.js
  params: { groupname: string };
}) {
  
  // [PERBAIKAN] Ambil groupname langsung,
  // tidak perlu 'await params'
  const groupname = decodeURIComponent(params.groupname);

  // [PERBAIKAN] Ambil data dari KEDUA tabel secara bersamaan
  const [replyAttributes, checkAttributes] = await Promise.all([
    // 1. Ambil atribut reply (seperti rate-limit)
    prisma.radgroupreply.findMany({
      where: {
        groupname: groupname,
      },
      orderBy: {
        attribute: 'asc',
      },
    }),
    // 2. Ambil atribut check (untuk batas device)
    prisma.radgroupcheck.findMany({
        where: {
            groupname: groupname,
            attribute: 'Simultaneous-Use' // Hanya ambil atribut yang kita perlu
        }
    })
  ]);

  // [PERBAIKAN] Cek apakah grup ada
  if (replyAttributes.length === 0 && checkAttributes.length === 0) {
      notFound(); // Tampilkan halaman 404 jika grup tidak ada
  }

  // [PERBAIKAN] Ekstrak nilai 'Simultaneous-Use'
  // Ambil data pertama dari array (jika ada), atau set ke string kosong
  const simultaneousUseValue = checkAttributes[0] ? checkAttributes[0].value : "";

  return (
    <div className="prose lg:prose-xl mb-6">
      <div className="flex justify-between items-center">
        {/* Judul lebih jelas untuk halaman edit */}
        <h1>Edit Grup: {groupname}</h1>
        <div className="flex gap-2">
            <Link href="/radius-groups" className="btn btn-ghost">
                ← Kembali
            </Link>
        </div>
      </div>

      <div className="not-prose mt-6">
        {/* [PERBAIKAN] Kirim data yang sudah dipisah ke Client Component
          (yang kemungkinan adalah Form Edit Anda).
          Ganti nama prop jika perlu.
        */}
        <GroupDetailClientWrapper
          initialReplyAttributes={replyAttributes}
          initialSimultaneousUse={simultaneousUseValue}
          groupname={groupname}
        />
      </div>
    </div>
  );
}