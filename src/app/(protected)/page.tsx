import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  // Mengambil data sesi di server
  const session = await getServerSession(authOptions);

  return (
    <div className="prose lg:prose-xl">
      <h1>Selamat Datang di Dashboard!</h1>
      <p>
        Anda login sebagai <strong>{session?.user?.name}</strong>.
      </p>
      <p>
        Ini adalah halaman utama yang dilindungi. Hanya pengguna yang sudah login
        yang bisa melihat halaman ini.
      </p>
    </div>
  );
}