"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { FaPlugCircleXmark } from "react-icons/fa6"; 

export default function DisconnectButton({ username }: { username: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDisconnect = async () => {
    setIsLoading(true);
    const toastId = toast.loading(`Memutus koneksi ${username}...`);

    try {
      const res = await fetch('/api/radius/users/online-users/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(`Gagal: ${data.message}`, { id: toastId });
      } else {
        toast.success(`Sukses: ${data.message}`, { id: toastId });
        location.reload(); 
      }
    } catch (error) {
      // --- [INI PERBAIKANNYA] ---
      // Kita harus periksa dulu apakah 'error' adalah instance dari Error
      if (error instanceof Error) {
        toast.error(`Error: ${error.message}`, { id: toastId });
      } else {
        // Jika bukan, kita tampilkan pesan generik
        toast.error("Terjadi kesalahan yang tidak diketahui.", { id: toastId });
      }
      // --- [AKHIR PERBAIKAN] ---

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className="btn btn-error btn-xs"
      onClick={handleDisconnect}
      disabled={isLoading}
      title="Putuskan Koneksi (Paksa Logout)"
    >
      {isLoading ? (
        <span className="loading loading-spinner loading-xs"></span>
      ) : (
        <FaPlugCircleXmark />
      )}
    </button>
  );
}