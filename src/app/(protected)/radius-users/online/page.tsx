"use client";

import { useState, useEffect } from "react";
// Impor 'date-fns' untuk memformat durasi
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import DisconnectButton from "@/components/DisconnectButton";

/**
 * Tipe data yang kita harapkan dari API
 * (sesuai perbaikan kita sebelumnya)
 */
type OnlineUser = {
  username: string;
  acctstarttime: string | null; // ISO string date
};

type ApiResponse = {
  onlineUsers: OnlineUser[];
};

// Atur seberapa sering data di-refresh
const POLLING_INTERVAL = 10000; // 10 detik

export default function OnlineUserTable() {
  const [users, setUsers] = useState<OnlineUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOnlineUsers = async () => {
    try {
      const res = await fetch('/api/radius/users/online-users/list');
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data: ApiResponse = await res.json();
      setUsers(data.onlineUsers);

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
  const formatDuration = (startTime: string | null) => {
    if (!startTime) return "N/A";
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
          <div className="flex justify-center items-center h-48">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </div>
    );
  }

  // Tampilan utama
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title mb-4">
          Total User Online: {users.length}
        </h2>
        <div className="overflow-x-auto">
          {users.length > 0 ? (
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Username</th>
                  <th>Login Sejak</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.username}>
                    <td>{index + 1}</td>
                    <td className="font-medium">{user.username}</td>
                    <td>{formatDuration(user.acctstarttime)}</td>
                    <td className="text-center">
                      {/* Tombol Disconnect */}
                      <DisconnectButton username={user.username} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center p-8">Tidak ada user yang online saat ini.</p>
          )}
        </div>
      </div>
    </div>
  );
}