"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
    userId: String;
};

export default function DeleteUserButton({ userId }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);  
    const router = useRouter();

    const handleDelete = async() => {
        setIsLoading(true);
        try{
            const res = await fetch(`/api/radius/users/${userId}`, {
                method: "DELETE"
            })
            if (!res.ok) {
                throw new Error("Failed to delete user");
            }
            setIsModalOpen(false);
            router.refresh()
        }catch(error){
            console.error(error);
        }finally{
            setIsLoading(false);
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
            <button className="btn" onClick={() => setIsModalOpen(false)}>Batal</button>
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
