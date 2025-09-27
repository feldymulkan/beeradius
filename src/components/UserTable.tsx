"use client";

import { useRouter } from "next/navigation";
import type { radcheck } from "@prisma/client";

type UserTableProps = {
  radchecks: radcheck[];
  page: number;
  pageSize: number;
  totalItems: number;
};

export default function UserTable({ radchecks, page, pageSize, totalItems }: UserTableProps) {
  const router = useRouter();
  const totalPages = Math.ceil(totalItems / pageSize);

  const changePage = (newPage: number) => {
    router.push(`/users?page=${newPage}&pageSize=${pageSize}`);
  };

  const changePageSize = (newSize: number) => {
    router.push(`/users?page=1&pageSize=${newSize}`);
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
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>No.</th>
              <th>Username</th>
              <th>Attribute</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {radchecks.map((entry, index) => (
              <tr key={entry.id} className="hover">
                <td>{(page - 1) * pageSize + index + 1}</td>
                <td>{entry.username}</td>
                <td>{entry.attribute}</td>
                <td>{entry.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
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
