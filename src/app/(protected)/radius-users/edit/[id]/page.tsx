"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { EditFormSkeleton } from "@/components/Skleton"; // Pastikan path dan nama file skeleton Anda benar
import { toast } from "react-hot-toast"; // 1. Impor toast

// Definisikan tipe untuk data grup
type Group = {
  groupname: string;
};

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // State untuk setiap field di form
  const [originalUsername, setOriginalUsername] = useState(""); // Untuk judul halaman
  const [username, setUsername] = useState("");         // Untuk input username yang bisa diubah
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("");
  const [groupname, setGroupname] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null); // State error masih berguna untuk logika internal

  // Fetch data user yang akan diedit
  useEffect(() => {
    if (id) {
      const fetchUserData = async () => {
        setIsFetching(true);
        try {
          const res = await fetch(`/api/radius/users/${id}`);
          if (!res.ok) throw new Error("Gagal memuat data user.");
          const data = await res.json();
          
          setOriginalUsername(data.username);
          setUsername(data.username);
          setFullName(data.fullName || "");
          setDepartment(data.department || "");
          setGroupname(data.group || "");
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
            toast.error(err.message); // Tampilkan error fetch dengan toast
          }
        } finally {
          setIsFetching(false);
        }
      };
      fetchUserData();
    }
  }, [id]);

  // Fetch daftar grup untuk dropdown
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch('/api/radius/groups');
        if (!res.ok) return;
        const data = await res.json();
        setGroups(Array.isArray(data) ? data : data.groups || []);
      } catch (err) {
        console.error("Gagal memuat daftar grup:", err);
      }
    };
    fetchGroups();
  }, []);

  // Handle pengiriman form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const body: { [key: string]: any } = { 
      newUsername: username,
      fullName, 
      department, 
      groupname 
    };
    if (newPassword) {
      body.newPassword = newPassword;
      body.passwordType = 'cleartext';
    }

    try {
      const res = await fetch(`/api/radius/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal mengupdate user.");
      }

      // 2. Tampilkan notifikasi sukses
      toast.success("Perubahan berhasil disimpan!");

      // 3. Beri jeda sejenak lalu redirect
      setTimeout(() => {
        router.push(`/radius-users/detail/${id}`);
        router.refresh();
      }, 1200); // Jeda 1.2 detik

    } catch (err: unknown) {
      if (err instanceof Error) {
        // 4. Tampilkan notifikasi error
        toast.error(err.message);
        setError(err.message);
      }
      setIsLoading(false); // Hentikan loading jika terjadi error
    } 
    // Jangan set isLoading ke false di 'finally' agar tombol tetap nonaktif selama redirect
  };

  if (isFetching) return <EditFormSkeleton />;
  if (error && !isFetching) return <div className="alert alert-error">{error}</div>;

  return (
    <div className="prose lg:prose-xl">
      <h1>Edit User: {originalUsername}</h1>
      <div className="not-prose">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <Link href={`/radius-users/detail/${id}`} className="btn btn-ghost btn-sm self-start">
              ← Kembali ke Detail
            </Link>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="form-control w-full">
                <label className="label"><span className="label-text font-bold">Username</span></label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="input input-bordered w-full" required />
              </div>
              
              <div className="form-control w-full">
                <label className="label"><span className="label-text">Nama Lengkap</span></label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="input input-bordered w-full" />
              </div>

              <div className="form-control w-full">
                <label className="label"><span className="label-text">Departemen</span></label>
                <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} className="input input-bordered w-full" />
              </div>

              <div className="form-control w-full">
                <label className="label"><span className="label-text">Grup</span></label>
                <select className="select select-bordered" value={groupname} onChange={(e) => setGroupname(e.target.value)}>
                    <option value="">-- Tidak ada grup --</option>
                    {groups.map(g => <option key={g.groupname} value={g.groupname}>{g.groupname}</option>)}
                </select>
              </div>

              <div className="form-control w-full">
                <label className="label"><span className="label-text">Password Baru (Opsional)</span></label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input input-bordered w-full" placeholder="Kosongkan jika tidak ingin diubah" />
              </div>

              <div className="card-actions justify-end pt-4">
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                  {isLoading && <span className="loading loading-spinner"></span>}
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}