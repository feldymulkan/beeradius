"use client";

import React from "react";

// Definisikan tipe untuk konfigurasi kolom
export type ColumnDef<T> = {
  header: string;                  // Teks untuk header <th>
  accessorKey: keyof T;            // Kunci untuk mengakses data di objek
  cell?: (item: T) => React.ReactNode; // Fungsi kustom untuk merender isi <td> (opsional)
  className?: string;              // Kelas CSS tambahan untuk <th> dan <td>
};

// Definisikan props untuk komponen tabel generik
type DataTableProps<T> = {
  data: T[];
  columns: ColumnDef<T>[];
};

export default function DataTable<T extends { id: any }>({ data, columns }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={String(column.accessorKey)} className={column.className}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="hover">
              {columns.map((column) => (
                <td key={String(column.accessorKey)} className={column.className}>
                  {/* Jika ada fungsi render 'cell', gunakan itu. Jika tidak, tampilkan data biasa. */}
                  {column.cell
                    ? column.cell(item)
                    : (item[column.accessorKey] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}