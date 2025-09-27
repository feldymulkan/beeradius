"use client";

import { useRouter, useSearchParams } from "next/navigation";

type PaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  baseUrl: string;
};

export default function PaginationControls({
  currentPage,
  totalPages,
  pageSize,
  baseUrl,
}: PaginationControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const changePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${baseUrl}?${params.toString()}`);
  };

  const changePageSize = (size: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1"); // reset ke halaman 1 saat ganti ukuran
    params.set("pageSize", size.toString());
    router.push(`${baseUrl}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-center gap-4 mt-4">
      {/* Dropdown pageSize */}
      <div className="flex items-center gap-2">
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

      {/* Navigasi halaman */}
      <div className="join">
        <button
          className="join-item btn btn-sm"
          disabled={currentPage <= 1}
          onClick={() => changePage(currentPage - 1)}
        >
          «
        </button>
        <button className="join-item btn btn-sm">
          Page {currentPage} of {totalPages}
        </button>
        <button
          className="join-item btn btn-sm"
          disabled={currentPage >= totalPages}
          onClick={() => changePage(currentPage + 1)}
        >
          »
        </button>
      </div>
    </div>
  );
}
