"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Definisikan props yang akan diterima komponen
type Props = {
  itemId: string | number;
  apiEndpoint: string;
  itemName: string;
  entityType: string;
  onSuccess?: () => void;
};

export default function DeleteButton({ itemId, apiEndpoint, itemName, entityType, onSuccess }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async() => {
    setIsLoading(true);
    try {
      const res = await fetch(`${apiEndpoint}/${itemId}`, {
        method: "DELETE"
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Gagal menghapus ${entityType}.`);
      }
      setIsModalOpen(false);
      if (onSuccess) {
        onSuccess();
      } else {
        router.refresh();
      }
    } catch(error: unknown) {
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button className="btn btn-sm btn-error" onClick={() => setIsModalOpen(true)}>
        Delete
      </button>

      <input
        type="checkbox"
        className="modal-toggle"
        checked={isModalOpen}
        onChange={() => setIsModalOpen(!isModalOpen)}
      />
      <div className="modal modal-bottom sm:modal-middle" role="dialog">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Konfirmasi Penghapusan</h3>
          {/* --- PERBAIKAN DI SINI --- */}
          {/* Mengganti ' dengan &apos; untuk memperbaiki error ESLint */}
          <p className="py-4">Apakah Anda yakin ingin menghapus {entityType} &apos;{itemName}&apos;? Tindakan ini tidak dapat dibatalkan.</p>
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
};
