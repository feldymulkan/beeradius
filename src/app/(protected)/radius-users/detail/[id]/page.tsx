import Link from "next/link";
import { getRadiusUserDetailsById } from "@/lib/data";
// 1. Import the new wrapper compone
import UserDeleteAction from "@/components/UserDeleteActions";
type RadiusAttribute = {
  attribute: string;
  op: string;
  value: string;
};

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const userId = parseInt(resolvedParams.id);

  if (isNaN(userId)) {
    return (
      <div className="prose text-center mx-auto mt-10">
        <h1>Error</h1>
        <p>ID user tidak valid.</p>
        <Link href="/radius-users" className="btn btn-primary">
          Kembali ke Daftar User
        </Link>
      </div>
    );
  }
  
  const userData = await getRadiusUserDetailsById(userId);

  return (
    <div className="prose lg:prose-xl">
      <h1>Detail User: {userData.username}</h1>
      <div className="not-prose">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-end gap-2">
              <Link href={`/radius-users/edit/${resolvedParams.id}`} className="btn btn-sm btn-info">Edit</Link>
              
              {/* 2. Replace the old button with the new wrapper */}
              <UserDeleteAction userId={userData.id} username={userData.username} />

              <Link href="/radius-users" className="btn btn-sm btn-ghost">← Kembali</Link>
            </div>
            
            <div className="space-y-4 mt-4">
              <div className="p-4 border rounded-lg bg-base-200">
                <h3 className="font-bold text-lg">Informasi Umum</h3>
                <p><strong>Nama Lengkap:</strong> {userData.fullName}</p>
                <p><strong>Departemen:</strong> {userData.department}</p>
                <p><strong>Grup:</strong> {userData.group}</p>
              </div>

              <div className="p-4 border rounded-lg bg-base-200">
                <h3 className="font-bold text-lg">Atribut RADIUS</h3>
                <div className="overflow-x-auto">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Attribute</th>
                        <th>Operator</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userData.checkAttributes.map((attr: RadiusAttribute, index: number) => (
                        <tr key={index}>
                          <td>{attr.attribute}</td>
                          <td>{attr.op}</td>
                          <td>{attr.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}