import prisma from "@/lib/prisma";
import Link from "next/link";
import GroupDetailClientWrapper from "@/components/GroupDetailClientWrapper";

export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ groupname: string }>;
}) {
  const resolvedParams = await params;
  const { groupname } = resolvedParams;

  // Ambil semua atribut untuk grup ini dari database
  const attributes = await prisma.radgroupreply.findMany({
    where: {
      groupname: groupname,
    },
    orderBy: {
      attribute: 'asc',
    },
  });

  return (
    <div className="prose lg:prose-xl mb-6">
      <div className="flex justify-between items-center">
        {/* Tampilkan nama grup yang di-decode dari URL */}
        <h1>Atribut Grup: {decodeURIComponent(groupname)}</h1>
        <div className="flex gap-2">
            {/* <Link href={`/radius-groups/add-attribute/${groupname}`} className="btn btn-primary">
                + Tambah Atribut
            </Link> */}
            <Link href="/radius-groups" className="btn btn-ghost">
                ← Kembali
            </Link>
        </div>
      </div>

      <div className="not-prose mt-6">
        <GroupDetailClientWrapper
          attributes={attributes}
          groupname={groupname}
        />
      </div>
    </div>
  );
}