"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export type ColumnDef<T> = {
  header: string;
  accessorKey: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
};

type DataTableProps<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  page?: number;
  pageSize?: number;
  totalPages?: number;
};

export default function DataTable<T extends { id: any }>({
  data,
  columns,
  page = 1,
  pageSize = 10,
  totalPages = 1,
}: DataTableProps<T>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>#</th>
            {columns.map((column) => (
              <th key={String(column.accessorKey)} className={column.className}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="text-center py-4">
                Tidak ada data ditemukan.
              </td>
            </tr>
          ) : (
            data.map((item, index) => {
              const rowNumber = (page - 1) * pageSize + index + 1;
              return (
                <tr key={item.id} className="hover">
                  <td>{rowNumber}</td>
                  {columns.map((column) => (
                    <td
                      key={String(column.accessorKey)}
                      className={column.className}
                    >
                      {column.cell
                        ? column.cell(item)
                        : (item[column.accessorKey] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="join mt-4 flex justify-end">
          <Link
            href={createPageURL(page - 1)}
            className={`join-item btn ${page <= 1 ? "btn-disabled" : ""}`}
          >
            «
          </Link>
          <button className="join-item btn">
            Halaman {page} dari {totalPages}
          </button>
          <Link
            href={createPageURL(page + 1)}
            className={`join-item btn ${page >= totalPages ? "btn-disabled" : ""}`}
          >
            »
          </Link>
        </div>
      )}
    </div>
  );
}
