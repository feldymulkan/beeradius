import prisma from "@/lib/prisma";
import Link from "next/link";
import UserClientWrapper from "@/components/UserClientWrapper"; 
import SearchInput from "@/components/SearchInput";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams?.page) || 1;
  const pageSize = Number(resolvedSearchParams?.pageSize) || 10;

  const query = resolvedSearchParams?.query as string | undefined;

  const whereClause = query ? { username : { contains: query} } : {};



  // Logika pengambilan data dari server (tetap sama)
  const groupedByUsername = await prisma.radcheck.groupBy({ 
    by: ['username'],
    where: whereClause,
  });
  const totalItems = groupedByUsername.length; // <-- Data ini akan kita gunakan

  const uniqueRadcheckUsers = await prisma.radcheck.findMany({
    distinct: ['username'],
    select: { id: true, username: true },
    where: whereClause,
    take: pageSize,
    skip: (page - 1) * pageSize,
    orderBy: { username: "asc" },
  });

  const usernames = uniqueRadcheckUsers.map(u => u.username);
  const [userInfos, userGroups] = await Promise.all([
    prisma.userinfo.findMany({
      where: { username: { in: usernames } },
      select: { username: true, fullName: true, department: true }
    }),
    prisma.radusergroup.findMany({
      where: { username: { in: usernames } },
      select: { username: true, groupname: true }
    })
  ]);

  const userInfoMap = new Map(userInfos.map(info => [info.username, info]));
  const userGroupMap = new Map(userGroups.map(group => [group.username, group]));

  const combinedUsers = uniqueRadcheckUsers.map(radUser => {
    const info = userInfoMap.get(radUser.username);
    const group = userGroupMap.get(radUser.username);
    return {
      id: radUser.id,
      username: radUser.username,
      fullName: info?.fullName || "N/A",
      department: info?.department || "N/A",
      groupname: group?.groupname || "N/A",
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

      <div className="not-prose stats shadow mt-6">
        <div className="stat">
          <div className="stat-figure text-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.084-1.284-.23-1.857M12 12c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6zM6 20v-2c0-.653.084-1.284.23-1.857m0 0A7.988 7.988 0 0112 13a7.988 7.988 0 015.77 5.143m-5.77 1.857A10 10 0 0012 21a10 10 0 00-5.77-1.857z"></path></svg>
          </div>
          <div className="stat-title">Total User Terdaftar</div>
          <div className="stat-value text-info">{totalItems}</div>
        </div>

      </div>
      <div className="not-prose mt-6">
        <SearchInput
          placeholder="Cari berdasarkan username..."
          queryKey="query"
        />
      </div>

      <div className="not-prose mt-6">
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