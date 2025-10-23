"use client";

import { useState, useEffect } from "react";
// Impor 'date-fns' untuk memformat durasi
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale'; // Untuk bahasa Indonesia

/**
 * Tipe data yang akan kita olah di internal komponen
 */
type OnlineUser = {
  username: string;
  startTime: string; // ISO string date
};

/**
 * Tipe data yang kita harapkan dari API Anda
 * (berdasarkan struktur JSON yang Anda kirim)
 */
type ApiResponse = {
  usernames: string[];
  startTime: (Date | null)[]; // API Anda mengirim array terpisah
};

// Atur seberapa sering data di-refresh
const POLLING_INTERVAL = 10000; // 10 detik

export default function RealtimeOnlineUsers() {
  const [users, setUsers] = useState<OnlineUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOnlineUsers = async () => {
    try {
      // Panggil API yang Anda buat
      const res = await fetch('/api/radius/users/online-users/list');
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data: ApiResponse = await res.json();

      // --- Menggabungkan Dua Array Terpisah ---
      // API Anda mengirim: { usernames: ['a', 'b'], startTime: ['9:00', '9:05'] }
      // Kita ubah menjadi: [ { username: 'a', startTime: '9:00' }, ... ]
      const combinedUsers = data.usernames.map((username, index) => ({
        username: username,
        // Ambil startTime di indeks yang sama
        startTime: data.startTime[index]?.toString() || new Date().toISOString(), 
      }));

      setUsers(combinedUsers);
    } catch (error) {
      console.error("Error mengambil user online:", error);
      setUsers([]); // Kosongkan jika error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 1. Ambil data saat komponen pertama kali dimuat
    fetchOnlineUsers();

    // 2. Atur interval untuk mengambil data secara berkala (polling)
    const intervalId = setInterval(fetchOnlineUsers, POLLING_INTERVAL);

    // 3. Bersihkan interval saat komponen tidak lagi ditampilkan
    return () => clearInterval(intervalId);
  }, []); // '[]' = hanya berjalan sekali saat mount

  /**
   * Fungsi untuk memformat durasi (mis: "5 menit yang lalu")
   */
  const formatDuration = (startTime: string) => {
    try {
      return formatDistanceToNow(new Date(startTime), {
        addSuffix: true,
        locale: id, // Tampilkan dalam Bahasa Indonesia
      });
    } catch (error) {
      return "N/A";
    }
  };
  // Tampilan saat loading
  if (isLoading) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">User Online</h2>
          <div className="flex justify-center items-center h-24">
            <span className="loading loading-spinner"></span>
          </div>
        </div>
      </div>
    );
  }

  // Tampilan utama
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">User Online ({users.length})</h2>
        {/* Batasi tinggi dan beri scroll jika daftar terlalu panjang */}
        <div className="overflow-x-auto max-h-96">
          {users.length > 0 ? (
            <table className="table table-sm table-zebra">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Login Sejak</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.username}>
                    <td className="font-medium">{user.username}</td>
                    <td>{formatDuration(user.startTime)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center p-4">Tidak ada user yang online.</p>
          )}
        </div>
      </div>
    </div>
  );
}