"use client";

import Link from "next/link";
import DataTable, { type ColumnDef } from "@/components/DataTable";
import DeleteButton from "@/components/DeleteButton";
import PaginationControls from "@/components/PaginationControls";

// Definisikan tipe data user yang diterima
type User = {
  id: number;
  username: string;
  fullName: string;
  department: string;
};

type Props = {
  users: User[];
  page: number;
  pageSize: number;
  totalPages: number;
};

export default function UserClientWrapper({ users, page, pageSize, totalPages }: Props) {
  // Definisikan 'columns' di dalam Client Component ini
  const columns: ColumnDef<User>[] = [
    {
      header: "Username",
      accessorKey: "username" 
    },
    { 
      header: "Nama Lengkap", 
      accessorKey: "fullName" 
    },
    { 
      header: "Departemen", 
      accessorKey: "department" 
    },
    {
      header: "Actions",
      accessorKey: "id", // Hanya sebagai key, tidak akan ditampilkan
      className: "text-center",
      cell: (user) => ( // Gunakan fungsi render 'cell' untuk tombol
        <div className="flex items-center justify-center gap-2">
          <Link href={`/radius-users/detail/${user.id}`} className="btn btn-sm btn-accent">Detail</Link>
          <DeleteButton 
            itemId={user.id} 
            itemName={user.username} 
            entityType="user" 
            apiEndpoint="/api/radius/users" 
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <DataTable 
        data={users} 
        columns={columns} 
        page={page}
        pageSize= {pageSize}
        />
      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        pageSize={pageSize}
        baseUrl="/radius-users"
      />
    </div>
  );
}