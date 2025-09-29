import prisma from "@/lib/prisma";
import Link from "next/link";

// Ikon untuk tombol dan statistik
const UserGroupIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
  </svg>
);

const CheckBadgeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
  </svg>
);

export default async function DashboardPage() {
  // Ambil data utama
  const [radcheckCount, recentRadchecks] = await Promise.all([
    prisma.radcheck.count(),
    prisma.radcheck.findMany({
      take: 5,
      orderBy: { id: "desc" },
    }),
  ]);

  // Hitung jumlah username unik
  const uniqueUsers = await prisma.radcheck.groupBy({
    by: ["username"],
    _count: { username: true },
  });
  const userCount = uniqueUsers.length;

  return (
    <div className="space-y-8">
      {/* Bagian Judul */}
      <div className="prose lg:prose-xl">
        <h1>Dashboard</h1>
        <p className="lead">Ringkasan data penting dari sistem Anda.</p>
      </div>

      {/* Bagian Kartu Statistik */}
      <div className="stats shadow w-full">
        <div className="stat">
          <div className="stat-figure text-primary"><UserGroupIcon /></div>
          <div className="stat-title">Total Users</div>
          <div className="stat-value text-primary">{userCount}</div>
          <div className="stat-desc">Username unik di radcheck</div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-secondary"><CheckBadgeIcon /></div>
          <div className="stat-title">Total Atribut Radcheck</div>
          <div className="stat-value text-secondary">{radcheckCount}</div>
          <div className="stat-desc">Jumlah total entri di database</div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-accent">
            <div className="avatar online">
              <div className="w-16 rounded-full">
                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
              </div>
            </div>
          </div>
          <div className="stat-value">86%</div>
          <div className="stat-title">Tugas Selesai</div>
          <div className="stat-desc text-accent">31 tugas tersisa</div>
        </div>
      </div>

      {/* Bagian Konten Utama (Tabel & Aksi Cepat) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Aktivitas Terbaru */}
        <div className="lg:col-span-2 card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Aktivitas Radcheck Terbaru</h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Username</th>
                    <th>Attribute</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRadchecks.map((entry, index) => (
                    <tr key={entry.id} className="hover">
                      <th>{index + 1}</th>
                      <td>{entry.username}</td>
                      <td>{entry.attribute}</td>
                      <td><span className="badge badge-ghost badge-sm">{entry.value}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Aksi Cepat */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Aksi Cepat</h2>
            <div className="flex flex-col gap-2">
              
              <Link href="/users" className="btn btn-primary">Manajemen Users</Link>
              <Link href="/radcheck" className="btn btn-secondary">Manajemen Radcheck</Link>
              <button className="btn btn-outline">Lihat Laporan</button>
            </div>
            <div className="divider">Statistik</div>
            <p className="text-center font-semibold">Pengguna Aktif Mingguan</p>
            <div
              className="radial-progress bg-primary text-primary-content border-4 border-primary"
              style={{ "--value": 70 } as React.CSSProperties}
              role="progressbar"
            >
              70%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
