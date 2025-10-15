"use client";

import Link from "next/link";
import DataTable, { type ColumnDef } from "@/components/DataTable";
import DeleteButton from "@/components/DeleteButton";
import PaginationControls from "@/components/PaginationControls";

// Definisikan tipe data yang diterima
type Group = {
  id: string;
  groupname: string;
};

type Props = {
  groups: Group[];
  page: number;
  pageSize: number;
  totalPages: number;
};

export default function GroupClientWrapper({ groups, page, pageSize, totalPages }: Props) {
  // Definisikan 'columns' di dalam Client Component ini
  const columns: ColumnDef<Group>[] = [
    { 
      header: "Nama Grup", 
      accessorKey: "groupname" 
    },
    {
      header: "Actions",
      accessorKey: "id",
      className: "text-center",
      cell: (group) => (
        <div className="flex items-center justify-center gap-2">
          <Link href={`/radius-groups/edit/${group.groupname}`} className="btn btn-sm btn-info">Edit</Link>
          <DeleteButton 
            itemId={group.groupname} 
            itemName={group.groupname} 
            entityType="grup" 
            apiEndpoint="/api/radius/groups" 
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <DataTable data={groups} columns={columns} />
      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        pageSize={pageSize}
        baseUrl="/radius-groups"
      />
    </div>
  );
}