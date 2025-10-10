"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import DeleteRadiusUserButton from "./DeleteRadiusUserButton";

// Definisikan tipe untuk data user yang baru
type CombinedUser = {
  id: number;
  username: string;
  fullName: string;
  department: string;
};

type UserInfoTableProps = {
  users: CombinedUser[]; // Prop diubah menjadi 'users'
  page: number;
  pageSize: number;
  totalItems: number;
};

export default function UserInfoTable({ users, page, pageSize, totalItems }: UserInfoTableProps) {
  const router = useRouter();
  const totalPages = Math.ceil(totalItems / pageSize);

  const changePage = (newPage: number) => {
    // Logika paginasi tidak berubah
    router.push(`/radius-users?page=${newPage}&pageSize=${pageSize}`);
  };

  const changePageSize = (newSize: number) => {
    router.push(`/radius-users?page=1&pageSize=${newSize}`);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
         <span className="text-sm">Items per page:</span>
         <select
           className="select select-bordered select-sm"
           value={pageSize}
           onChange={(e) => changePageSize(Number(e.target.value))}
         >
           <option value={10}>10</option>
           <option value={20}>20</option>
           <option value={50}>50</option>
           <option value={100}>100</option>
         </select>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            {/* Header tabel diubah sesuai data userinfo */}
            <tr>
              <th>No.</th>
              <th>Username</th>
              <th>Nama Lengkap</th>
              <th>Departemen</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Tampilkan data dari prop 'users' yang baru */}
            {users.map((user, index) => (
              <tr key={user.id} className="hover">
                <td>{(page - 1) * pageSize + index + 1}</td>
                <td>{user.username}</td>
                <td>{user.fullName}</td>
                <td>{user.department}</td>
                <td>
                  <div className="flex items-center justify-center gap-2">
                    <Link 
                      href={`/radius-users/detail/${user.id}`}
                      className="btn btn-sm btn-accent"
                    >
                      Detail
                    </Link>
                    <DeleteRadiusUserButton userId={user.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="join mt-4 flex justify-center">
         <button
           className="join-item btn btn-sm"
           disabled={page <= 1}
           onClick={() => changePage(page - 1)}
         >
           «
         </button>
         <button className="join-item btn btn-sm">
           Page {page} of {totalPages}
         </button>
         <button
           className="join-item btn btn-sm"
           disabled={page >= totalPages}
           onClick={() => changePage(page + 1)}
         >
           »
         </button>
      </div>
    </div>
  );
}