import prisma from "@/lib/prisma";
import UserTable from "@/components/UserTable";
import Link from "next/link";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const page = Number(params?.page ?? 1);
  const pageSize = Number(params?.pageSize ?? 10);

  const totalItems = await prisma.radcheck.count();
  const radchecks = await prisma.radcheck.findMany({
    take: pageSize,
    skip: (page - 1) * pageSize,
    orderBy: { username: "asc" },
  });

  return (
    <div className="prose lg:prose-xl mb-6">
      <div className="flex justify-between items-center">
        <h1>Username</h1>
        <Link href="/users/create" className="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Tambah User Baru
        </Link>
      </div>

      <div className="not-prose">
        <UserTable
          radchecks={radchecks}
          page={page}
          pageSize={pageSize}
          totalItems={totalItems}
        />
      </div>
    </div>
  );
}
