"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { EditFormSkeleton } from "@/components/Skleton";

type Attribute = {
  id?: number; 
  attribute: string;
  op: string;
  value: string;
};

export default function EditGroupPage() {
  const router = useRouter();
  const params = useParams();
  const originalGroupname = decodeURIComponent(params.groupname as string);

  // State untuk form
  const [newGroupname, setNewGroupname] = useState(originalGroupname);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  
  // State khusus untuk speed agar UI lebih baik
  const [uploadSpeed, setUploadSpeed] = useState("");
  const [downloadSpeed, setDownloadSpeed] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data dan ekstrak speed
  useEffect(() => {
    if (originalGroupname) {
      const fetchGroupData = async () => {
        setIsFetching(true);
        try {
          const res = await fetch(`/api/radius/groups/${originalGroupname}`);
          if (!res.ok) throw new Error("Gagal memuat data grup.");
          const data: Attribute[] = await res.json();
          setAttributes(data);

          // Cari atribut Mikrotik-Rate-Limit dan ekstrak nilainya
          const rateLimitAttr = data.find(attr => attr.attribute === 'Mikrotik-Rate-Limit');
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

    // --- Logika untuk menyusun kembali atribut sebelum kirim ---
    const finalAttributes = [...attributes];
    const rateLimitIndex = finalAttributes.findIndex(attr => attr.attribute === 'Mikrotik-Rate-Limit');
    
    // Buat value baru untuk rate limit
    const rateLimitValue = `${uploadSpeed || 0}M/${downloadSpeed || 0}M`;

    if (rateLimitIndex > -1) {
      // Jika atribut sudah ada, update nilainya
      finalAttributes[rateLimitIndex].value = rateLimitValue;
    } else if (uploadSpeed || downloadSpeed) {
      // Jika belum ada tapi speed diisi, tambahkan atribut baru
      finalAttributes.push({ attribute: 'Mikrotik-Rate-Limit', op: ':=', value: rateLimitValue });
    }
    // -----------------------------------------------------------

    try {
      const res = await fetch(`/api/radius/groups/${originalGroupname}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newGroupname, attributes: finalAttributes }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal mengupdate grup.");
      }
      router.push("/radius-groups");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
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
              {/* Input Nama Grup yang sudah bisa diedit */}
              <div className="form-control w-full">
                <label className="label"><span className="label-text font-bold">Nama Grup</span></label>
                <input type="text" value={newGroupname} onChange={(e) => setNewGroupname(e.target.value)} className="input input-bordered w-full" required />
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
                <p className="text-xs text-gray-500 mt-1">Atribut lain yang tidak terkait kecepatan tidak akan ditampilkan di sini, namun akan tetap tersimpan.</p>
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