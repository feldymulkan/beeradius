"use client";

import Link from "next/link";
import DataTable, { type ColumnDef } from "@/components/DataTable";
import DeleteButton from "@/components/DeleteButton";

// Definisikan tipe untuk atribut
type Attribute = {
  id: number;
  attribute: string;
  op: string;
  value: string;
};

type Props = {
  attributes: Attribute[];
  groupname: string;
};

export default function GroupDetailClientWrapper({ attributes, groupname }: Props) {
  // Definisikan 'columns' untuk tabel atribut di sini
  const columns: ColumnDef<Attribute>[] = [
    { header: "Attribute", accessorKey: "attribute" },
    { header: "Operator", accessorKey: "op" },
    { header: "Value", accessorKey: "value" },
    {
      header: "Actions",
      accessorKey: "id",
      className: "text-center",
      cell: (attr) => (
        <div className="flex items-center justify-center gap-2">
          <Link href={`/radius-groups/edit/${groupname}`} className="btn btn-sm btn-info">Edit</Link>
          {/* <DeleteButton
            itemId={attr.id}
            itemName={`${attr.attribute} (${attr.value})`}
            entityType="atribut"
            apiEndpoint="/api/radius/attributes"
          /> */}
        </div>
      ),
    },
  ];

  return (
    <div>
      <DataTable data={attributes} columns={columns} />
    </div>
  );
}