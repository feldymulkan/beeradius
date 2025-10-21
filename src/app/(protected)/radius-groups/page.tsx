import Link from "next/link";
import prisma from "@/lib/prisma";
import GroupClientWrapper from "@/components/GroupClientWrapper";

export default async function RadiusGroupsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams?.page) || 1;
  const pageSize = Number(resolvedSearchParams?.pageSize) || 10;

  // --- BAGIAN YANG DIPERBAIKI: Query yang Lebih Andal ---

  // 1. Ambil semua nama grup dari KEDUA tabel (check dan reply)
  const replyGroups = await prisma.radgroupreply.findMany({
    distinct: ['groupname'],
    select: { groupname: true },
  });
  const checkGroups = await prisma.radgroupcheck.findMany({
    distinct: ['groupname'],
    select: { groupname: true },
  });
  const allGroupNames = new Set([
    ...replyGroups.map(g => g.groupname.trim()),
    ...checkGroups.map(g => g.groupname.trim())
  ]);
  
  // 3. Ubah kembali menjadi array dan urutkan
  const uniqueSortedGroups = Array.from(allGroupNames).sort();
  
  const totalItems = uniqueSortedGroups.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  // 4. Lakukan paginasi secara manual dari array yang sudah bersih
  const paginatedGroupNames = uniqueSortedGroups.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // 5. Ubah kembali ke format objek yang dibutuhkan
  const groupsWithId = paginatedGroupNames.map(name => ({
    id: name,
    groupname: name,
  }));

  return (
    <div className="prose lg:prose-xl mb-6">
      <div className="flex justify-between items-center">
        <h1>Manajemen Grup RADIUS</h1>
        <Link href="/radius-groups/create" className="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Tambah Grup Baru
        </Link>
      </div>

      <div className="not-prose mt-6">
        <GroupClientWrapper 
          groups={groupsWithId}
          page={page}
          pageSize={pageSize}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}