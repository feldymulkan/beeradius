"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { EditFormSkeleton } from "@/components/Skleton"; // Asumsi path Skleton benar
import toast from "react-hot-toast";

// Tipe data untuk atribut 'reply'
type ReplyAttribute = {
  id?: number;
  attribute: string;
  op: string;
  value: string;
};

// [PERBAIKAN] Tipe data respons dari API GET Anda
type GroupDataResponse = {
  replyAttributes: ReplyAttribute[];
  simultaneousUse: string;
};

export default function EditGroupPage() {
  const router = useRouter();
  const params = useParams();
  const originalGroupname = decodeURIComponent(params.groupname as string);

  // State untuk form
  const [newGroupname, setNewGroupname] = useState(originalGroupname);
  
  // State khusus untuk speed
  const [uploadSpeed, setUploadSpeed] = useState("");
  const [downloadSpeed, setDownloadSpeed] = useState("");

  // [PERBAIKAN] State baru untuk batas perangkat
  const [simultaneousUse, setSimultaneousUse] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // [PERBAIKAN] Fetch data dan ekstrak speed + simultaneousUse
  useEffect(() => {
    if (originalGroupname) {
      const fetchGroupData = async () => {
        setIsFetching(true);
        try {
          const res = await fetch(`/api/radius/groups/${originalGroupname}`);
          if (!res.ok) throw new Error("Gagal memuat data grup.");
          
          // [PERBAIKAN] Tangani respons objek yang baru
          const data: GroupDataResponse = await res.json();
          
          // Set state batas perangkat
          setSimultaneousUse(data.simultaneousUse || "");

          // Cari atribut Mikrotik-Rate-Limit dari 'replyAttributes'
          const rateLimitAttr = data.replyAttributes.find(
            (attr) => attr.attribute === 'Mikrotik-Rate-Limit'
          );
          
          if (rateLimitAttr && rateLimitAttr.value.includes('/')) {
            const [up, down] = rateLimitAttr.value.replace(/M/g, '').split('/');
            setUploadSpeed(up || "");
            setDownloadSpeed(down || "");
          }
        } catch (err: unknown) {
          if (err instanceof Error) setError(err.message);
        } finally {
          setIsFetching(false);
        }
      };
      fetchGroupData();
    }
  }, [originalGroupname]);

  // Handle submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Buat ulang atribut 'reply' (hanya rate-limit untuk saat ini)
    const rateLimitValue = `${uploadSpeed || 0}M/${downloadSpeed || 0}M`;
    const finalAttributes = [
        { attribute: 'Mikrotik-Rate-Limit', op: ':=', value: rateLimitValue }
    ];

    // [PERBAIKAN] Siapkan body payload lengkap untuk API PUT
    const bodyPayload = {
        newGroupname,
        attributes: finalAttributes,
        simultaneousUse: simultaneousUse // <-- Kirim data batas perangkat
    };

    try {
      const res = await fetch(`/api/radius/groups/${originalGroupname}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload), // Kirim payload lengkap
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal mengupdate grup.");
      }
      
      toast.success("Grup berhasil diupdate!"); // Tambahkan notifikasi
      router.push("/radius-groups");
      router.refresh();
      
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message); // Tampilkan error di toast
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return <EditFormSkeleton />;

  return (
    <div className="prose lg:prose-xl">
      <h1>Edit Grup: {originalGroupname}</h1>
      <div className="not-prose">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="form-control w-full">
                <label className="label"><span className="label-text font-bold">Nama Grup</span></label>
                <input type="text" value={newGroupname} onChange={(e) => setNewGroupname(e.target.value)} className="input input-bordered w-full" required />
              </div>
              
              {/* [PERBAIKAN] Input baru untuk Batas Perangkat */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-bold">Batas Perangkat (Simultaneous-Use)</span>
                </label>
                <input 
                  type="number" 
                  value={simultaneousUse} 
                  onChange={(e) => setSimultaneousUse(e.target.value)} 
                  className="input input-bordered w-full" 
                  placeholder="Contoh: 2 (Kosongkan jika tidak ada batas)"
                  min="0"
                />
              </div>

              {/* Input khusus untuk Kecepatan */}
              <div>
                <label className="label"><span className="label-text font-bold">Batas Kecepatan (Mikrotik-Rate-Limit)</span></label>
                <div className="flex items-end gap-4 p-4 border rounded-md">
                    <div className="form-control w-1/2">
                        <label className="label"><span className="label-text">Upload Speed (Mbps)</span></label>
                        <input type="number" value={uploadSpeed} onChange={e => setUploadSpeed(e.target.value)} className="input input-bordered w-full" placeholder="Contoh: 5" />
                    </div>
                    <div className="form-control w-1/2">
                        <label className="label"><span className="label-text">Download Speed (Mbps)</span></label>
                        <input type="number" value={downloadSpeed} onChange={e => setDownloadSpeed(e.target.value)} className="input input-bordered w-full" placeholder="Contoh: 10" />
                    </div>
                </div>
              </div>

              {error && <div className="alert alert-error">{error}</div>}

              <div className="card-actions justify-end pt-4">
                <Link href="/radius-groups" className="btn btn-ghost">Batal</Link>
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                  {isLoading ? <span className="loading loading-spinner"></span> : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}