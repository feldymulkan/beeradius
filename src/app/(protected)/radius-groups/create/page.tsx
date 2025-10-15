"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateGroupPage() {
  const router = useRouter();
  
  // 1. State disederhanakan, tidak ada lagi array atribut yang rumit
  const [groupname, setGroupname] = useState("");
  const [uploadSpeed, setUploadSpeed] = useState("");
  const [downloadSpeed, setDownloadSpeed] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2. Fungsi untuk mengirim form yang sudah dimodifikasi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupname.trim()) {
      setError("Nama grup harus diisi.");
      return;
    }
    setIsLoading(true);
    setError(null);

    // --- Di sinilah "keajaibannya" terjadi ---
    // Kita buat sendiri atribut teknisnya berdasarkan input form yang sederhana
    const rateLimitValue = `${uploadSpeed || 0}M/${downloadSpeed || 0}M`;
    const finalAttributes = [
      {
        attribute: 'Mikrotik-Rate-Limit',
        op: ':=',
        value: rateLimitValue,
      },
      // Anda bisa menambahkan atribut default lain di sini jika perlu
    ];
    // ------------------------------------------

    try {
      const res = await fetch('/api/radius/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Kirim data yang sudah kita susun ke API
        body: JSON.stringify({ groupname, attributes: finalAttributes }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal membuat grup.");
      }

      router.push("/radius-groups");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="prose lg:prose-xl">
      <h1>Tambah Grup RADIUS Baru</h1>
      <div className="not-prose">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <Link href="/radius-groups" className="btn btn-ghost btn-sm self-start">
              ← Kembali ke Daftar Grup
            </Link>
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              {/* Field Nama Grup */}
              <div className="form-control w-full">
                <label className="label"><span className="label-text font-bold">Nama Grup</span></label>
                <input 
                  type="text" 
                  value={groupname} 
                  onChange={(e) => setGroupname(e.target.value)} 
                  className="input input-bordered w-full" 
                  placeholder="Contoh: Paket 10Mbps" 
                  required 
                />
              </div>

              {/* 3. Form disederhanakan, hanya untuk kecepatan */}
              <div>
                <label className="label"><span className="label-text font-bold">Batas Kecepatan (dalam Mbps)</span></label>
                <div className="flex items-end gap-4 p-4 border rounded-md">
                    <div className="form-control w-1/2">
                        <label className="label"><span className="label-text">Kecepatan Upload</span></label>
                        <input 
                          type="number" 
                          value={uploadSpeed} 
                          onChange={e => setUploadSpeed(e.target.value)} 
                          className="input input-bordered w-full" 
                          placeholder="Contoh: 5" 
                        />
                    </div>
                    <div className="form-control w-1/2">
                        <label className="label"><span className="label-text">Kecepatan Download</span></label>
                        <input 
                          type="number" 
                          value={downloadSpeed} 
                          onChange={e => setDownloadSpeed(e.target.value)} 
                          className="input input-bordered w-full" 
                          placeholder="Contoh: 10" 
                        />
                    </div>
                </div>
              </div>

              {error && <div className="alert alert-error">{error}</div>}

              <div className="card-actions justify-end pt-4">
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                  {isLoading ? <span className="loading loading-spinner"></span> : "Simpan Grup"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}