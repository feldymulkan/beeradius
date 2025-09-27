import prisma from "@/lib/prisma";
import UserTable from "@/components/UserTable";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // ✅ tunggu promise dari Next.js 15
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
      <h1>Username</h1>
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
