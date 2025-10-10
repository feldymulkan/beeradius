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