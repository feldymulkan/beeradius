import prisma from "@/lib/prisma";
import Link from "next/link";
import UserClientWrapper from "@/components/UserClientWrapper"; 

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams?.page) || 1;
  const pageSize = Number(resolvedSearchParams?.pageSize) || 10;

  // Logika pengambilan data dari server (tetap sama)
  const groupedByUsername = await prisma.radcheck.groupBy({ by: ['username'] });
  const totalItems = groupedByUsername.length;

  const uniqueRadcheckUsers = await prisma.radcheck.findMany({
    distinct: ['username'],
    select: { id: true, username: true },
    take: pageSize,
    skip: (page - 1) * pageSize,
    orderBy: { username: "asc" },
  });

  const usernames = uniqueRadcheckUsers.map(u => u.username);
  const userInfos = await prisma.userinfo.findMany({
    where: { username: { in: usernames } },
    select: { username: true, fullName: true, department: true }
  });

  const combinedUsers = uniqueRadcheckUsers.map(radUser => {
    const info = userInfos.find(info => info.username === radUser.username);
    return {
      id: radUser.id,
      username: radUser.username,
      fullName: info?.fullName || "N/A",
      department: info?.department || "N/A",
    };
  });

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className="prose lg:prose-xl mb-6">
      <div className="flex justify-between items-center">
        <h1>Manajemen User</h1>
          <Link href="/radius-users/create" className="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Tambah User Baru
        </Link>
      </div>

      <div className="not-prose mt-6">
        {/* Panggil komponen wrapper dengan semua data yang dibutuhkan */}
        <UserClientWrapper 
          users={combinedUsers}
          page={page}
          pageSize={pageSize}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}