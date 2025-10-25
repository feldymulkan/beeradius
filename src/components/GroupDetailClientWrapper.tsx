"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Tipe data untuk atribut 'reply'
type ReplyAttribute = {
  id: number;
  groupname: string;
  attribute: string;
  op: string;
  value: string;
};

// 1. [PERBAIKAN] Tipe Props baru agar cocok dengan 'page.tsx'
type Props = {
  initialReplyAttributes: ReplyAttribute[];
  initialSimultaneousUse: string;
  groupname: string; // Ini adalah groupname LAMA (untuk URL API)
};

/**
 * Helper function untuk mem-parsing '5M/10M' menjadi [5, 10]
 */
const parseRateLimit = (attributes: ReplyAttribute[]): [string, string] => {
  const rateAttr = attributes.find(
    (attr) => attr.attribute === 'Mikrotik-Rate-Limit'
  );
  if (!rateAttr) return ["", ""];
  
  const [upload, download] = rateAttr.value.split('/');
  return [
    upload.replace('M', '') || '0',
    download.replace('M', '') || '0',
  ];
};


export default function GroupDetailClientWrapper({
  initialReplyAttributes,
  initialSimultaneousUse,
  groupname,
}: Props) {
  const router = useRouter();

  // 2. [PERBAIKAN] State untuk form edit
  // Kita pisahkan groupname baru dan lama
  const [newGroupname, setNewGroupname] = useState(groupname);
  const [uploadSpeed, setUploadSpeed] = useState("");
  const [downloadSpeed, setDownloadSpeed] = useState("");
  const [simultaneousUse, setSimultaneousUse] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);

  // 3. [PERBAIKAN] 'useEffect' untuk mengisi form dengan data awal
  useEffect(() => {
    // Parse 'Mikrotik-Rate-Limit'
    const [initialUpload, initialDownload] = parseRateLimit(initialReplyAttributes);
    
    setUploadSpeed(initialUpload);
    setDownloadSpeed(initialDownload);
    
    // Set 'Simultaneous-Use'
    setSimultaneousUse(initialSimultaneousUse);
  }, [initialReplyAttributes, initialSimultaneousUse]);


  // 4. [PERBAIKAN] HandleSubmit untuk request 'PUT'
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupname.trim()) {
      toast.error("Nama grup harus diisi.");
      return;
    }
    setIsLoading(true);

    // Buat ulang atribut rate-limit
    const rateLimitValue = `${uploadSpeed || 0}M/${downloadSpeed || 0}M`;
    const finalAttributes = [
      {
        attribute: 'Mikrotik-Rate-Limit',
        op: ':=',
        value: rateLimitValue,
      },
    ];

    // Buat payload untuk API
    const bodyPayload = {
      newGroupname: newGroupname,
      attributes: finalAttributes,
      simultaneousUse: simultaneousUse,
    };

    try {
      // Panggil API PUT. Perhatikan URL-nya menggunakan 'groupname' (lama)
      const res = await fetch(`/api/radius/groups/${groupname}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal mengupdate grup.");
      }

      toast.success(data.message);
      router.push("/radius-groups");
      router.refresh();

    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          
          {/* Field Nama Grup */}
          <div className="form-control w-full">
            <label className="label"><span className="label-text font-bold">Nama Grup</span></label>
            <input 
              type="text" 
              value={newGroupname} // State-nya 'newGroupname'
              onChange={(e) => setNewGroupname(e.target.value)} 
              className="input input-bordered w-full" 
              required 
            />
          </div>

          {/* 5. [PERBAIKAN] Input untuk 'Simultaneous-Use' */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-bold">Batas Perangkat (Simultaneous-Use)</span>
            </label>
            <input 
              type="number" 
              value={simultaneousUse} // State-nya 'simultaneousUse'
              onChange={(e) => setSimultaneousUse(e.target.value)} 
              className="input input-bordered w-full" 
              placeholder="Contoh: 2 (Kosongkan jika tidak ada batas)"
              min="0"
            />
          </div>

          {/* Form batas kecepatan */}
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

          <div className="card-actions justify-end pt-4">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? <span className="loading loading-spinner"></span> : "Update Grup"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}