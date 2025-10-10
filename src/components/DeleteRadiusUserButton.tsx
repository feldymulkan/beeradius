"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteRadiusUserButton({ userId }: { userId: number }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/radius/users/${userId}`, {
        method: 'DELETE',
      });

      // Jika respons dari server tidak sukses (bukan status 2xx)
      if (!res.ok) {
        // Pertama, baca respons sebagai teks biasa. Ini tidak akan gagal.
        const errorText = await res.text();
        // Tampilkan raw response di konsol browser untuk debugging
        console.error("Raw error response from server:", errorText); 

        let errorMessage = "Gagal menghapus user.";
        try {
          // Coba ubah teks tersebut menjadi JSON
          const errorData = JSON.parse(errorText);
          // Jika berhasil, gunakan pesan error dari JSON
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          // Jika gagal (karena isinya HTML), gunakan potongan teks sebagai pesan error
          errorMessage = "Terjadi kesalahan pada server. Cek konsol untuk detail.";
        }
        // Lemparkan error dengan pesan yang lebih informatif
        throw new Error(errorMessage);
      }

      // Jika sukses
      setIsModalOpen(false);
      router.push('/radius-users');
      router.refresh(); 

    } catch (error: unknown) {
      // Tangkap error yang dilempar dan tampilkan dalam sebuah alert
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert("Terjadi kesalahan yang tidak diketahui.");
      }
      // Kita sudah log errorText di atas, jadi console.error(error) di sini opsional
    } finally {
      setIsLoading(false);
      // Selalu tutup modal setelah selesai, baik sukses maupun gagal
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <button className="btn btn-sm btn-error" onClick={() => setIsModalOpen(true)}>
        Delete
      </button>

      {/* Modal Konfirmasi */}
      <input type="checkbox" className="modal-toggle" checked={isModalOpen} readOnly />
      <div className="modal modal-bottom sm:modal-middle" role="dialog">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Konfirmasi Penghapusan</h3>
          <p className="py-4">Apakah Anda yakin ingin menghapus user ini? Tindakan ini tidak dapat dibatalkan.</p>
          <div className="modal-action">
            <button className="btn" onClick={() => setIsModalOpen(false)} disabled={isLoading}>Batal</button>
            <button className="btn btn-error" onClick={handleDelete} disabled={isLoading}>
              {isLoading && <span className="loading loading-spinner"></span>}
              Ya, Hapus
            </button>
          </div>
        </div>
      </div>
    </>
  );
}