import OnlineUserCount from "./OnlineUserCount";

export default function TableSkeleton() {
  // Membuat array untuk me-looping dan membuat baris skeleton
  const skeletonRows = Array.from({ length: 10 }); // Jumlah baris placeholder

  return (
    <div className="prose lg:prose-xl mb-6">
      {/* Skeleton untuk Header Halaman */}
      <div className="flex justify-between items-center">
        <div className="skeleton h-10 w-64"></div>
        <div className="skeleton h-12 w-48"></div>
      </div>

      <div className="not-prose">
        {/* Skeleton untuk Kontrol Tabel */}
        <div className="flex items-center gap-2 mb-2">
          <div className="skeleton h-4 w-28"></div>
          <div className="skeleton h-8 w-24"></div>
        </div>

        {/* Skeleton untuk Tabel */}
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>No.</th>
                <th>Username</th>
                <th>Nama Lengkap</th>
                <th>Departemen</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {skeletonRows.map((_, index) => (
                <tr key={index}>
                  <td><div className="skeleton h-4 w-8"></div></td>
                  <td><div className="skeleton h-4 w-32"></div></td>
                  <td><div className="skeleton h-4 w-48"></div></td>
                  <td><div className="skeleton h-4 w-24"></div></td>
                  <td>
                    <div className="flex items-center justify-center gap-2">
                      <div className="skeleton h-8 w-20"></div>
                      <div className="skeleton h-8 w-20"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Skeleton untuk Paginasi */}
        <div className="join mt-4 flex justify-center">
          <div className="skeleton h-8 w-16"></div>
          <div className="skeleton h-8 w-32"></div>
          <div className="skeleton h-8 w-16"></div>
        </div>
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="prose lg:prose-xl">
      {/* Skeleton untuk Judul */}
      <div className="skeleton h-10 w-1/2"></div>

      <div className="not-prose">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            {/* Skeleton untuk Tombol */}
            <div className="flex justify-end gap-2">
              <div className="skeleton h-8 w-20"></div>
              <div className="skeleton h-8 w-24"></div>
              <div className="skeleton h-8 w-28"></div>
            </div>

            <div className="space-y-4 mt-4">
              {/* Skeleton untuk Info Umum */}
              <div className="p-4 border rounded-lg bg-base-200">
                <div className="skeleton h-7 w-48 mb-4"></div>
                <div className="skeleton h-4 w-full mb-2"></div>
                <div className="skeleton h-4 w-full mb-2"></div>
                <div className="skeleton h-4 w-3/4"></div>
              </div>

              {/* Skeleton untuk Tabel Atribut */}
              <div className="p-4 border rounded-lg bg-base-200">
                <div className="skeleton h-7 w-56 mb-4"></div>
                <div className="skeleton h-4 w-full mb-2"></div>
                <div className="skeleton h-4 w-full mb-2"></div>
                <div className="skeleton h-4 w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EditFormSkeleton() {
  return (
    <div className="prose lg:prose-xl">
      {/* Skeleton Judul */}
      <div className="skeleton h-10 w-72"></div>

      <div className="not-prose">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            {/* Skeleton Tombol Kembali */}
            <div className="skeleton h-8 w-40"></div>

            <div className="space-y-4 mt-4">
              {/* Skeleton untuk 4 field input */}
              <div className="form-control w-full space-y-2">
                <div className="skeleton h-5 w-32"></div>
                <div className="skeleton h-12 w-full"></div>
              </div>
              <div className="form-control w-full space-y-2">
                <div className="skeleton h-5 w-32"></div>
                <div className="skeleton h-12 w-full"></div>
              </div>
              <div className="form-control w-full space-y-2">
                <div className="skeleton h-5 w-24"></div>
                <div className="skeleton h-12 w-full"></div>
              </div>
              <div className="form-control w-full space-y-2">
                <div className="skeleton h-5 w-48"></div>
                <div className="skeleton h-12 w-full"></div>
              </div>

              {/* Skeleton Tombol Simpan */}
              <div className="card-actions justify-end pt-4">
                <div className="skeleton h-12 w-44"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardLoading() {
  return (
    <div className="mb-6">
      <h1>Dashboard</h1>

      <div className="flex justify-center mt-6">
        <div className="not-prose stats stats-vertical lg:stats-horizontal shadow">

          {/* 1. Komponen User Online */}
          <OnlineUserCount />

          {/* 2. Total User */}
          <div className="stat">
            <div className="stat-figure text-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.084-1.284-.23-1.857M12 12
                  c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6zM6 20v-2c0-.653.084-1.284-.23-1.857m0
                  0A7.988 7.988 0 0112 13a7.988 7.988 0 015.77 5.143m-5.77 1.857A10 10 0 0012 21a10 10 0
                  00-5.77-1.857z">
                </path>
              </svg>
            </div>
            <div className="stat-title">Total User</div>
            <div className="stat-value text-info">
              <span className="skeleton h-8 w-24"></span>
            </div>
            <div className="stat-desc">User terdaftar</div>
          </div>

          {/* 3. Total Grup */}
          <div className="stat">
            <div className="stat-figure text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2
                  2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0
                  00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2
                  0 012-2h6a2 2 0 012 2v2M7 7h10">
                </path>
              </svg>
            </div>
            <div className="stat-title">Total Grup</div>
            <div className="stat-value text-accent">
              <span className="skeleton h-8 w-24"></span>
            </div>
            <div className="stat-desc">Grup profil</div>
          </div>
        </div>
      </div>
    </div>
  );
}