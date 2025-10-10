"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

// Definisikan tipe untuk data grup
type Group = {
  groupname: string;
};

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string; // Ambil ID dari URL

  // State untuk setiap field di form
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("");
  const [groupname, setGroupname] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [groups, setGroups] = useState<Group[]>([]); // State untuk daftar grup
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch data user yang akan diedit saat halaman dimuat
  useEffect(() => {
    if (id) {
      const fetchUserData = async () => {
        try {
          const res = await fetch(`/api/radius/users/${id}`);
          if (!res.ok) throw new Error("Gagal memuat data user.");
          const data = await res.json();
          // Isi state dengan data yang ada
          setUsername(data.username);
          setFullName(data.fullName || "");
          setDepartment(data.department || "");
          setGroupname(data.group || "");
        } catch (err: unknown) {
          if (err instanceof Error) setError(err.message);
        }
      };
      fetchUserData();
    }
  }, [id]);

  // 2. Fetch daftar grup untuk dropdown
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch('/api/radius/groups');
        const data = await res.json();
        setGroups(data.groups || []);
      } catch (err) {
        console.error("Gagal memuat grup:", err);
      }
    };
    fetchGroups();
  }, []);

  // 3. Handle pengiriman form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Siapkan body request, hanya kirim field yang diisi
    const body: { [key: string]: string } = { fullName, department, groupname };
    if (newPassword) {
      body.newPassword = newPassword;
      body.passwordType = 'cleartext'; // Sesuaikan jika perlu
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

      // Arahkan kembali ke halaman detail setelah sukses
      router.push(`/radius-users/detail/${id}`);
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="prose lg:prose-xl">
      <h1>Edit User: {username}</h1>
      <div className="not-prose">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <Link href={`/radius-users/detail/${id}`} className="btn btn-ghost btn-sm self-start">
              ← Kembali ke Detail
            </Link>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {/* Field Nama Lengkap */}
              <div className="form-control w-full">
                <label className="label"><span className="label-text">Nama Lengkap</span></label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="input input-bordered w-full" />
              </div>

              {/* Field Departemen */}
              <div className="form-control w-full">
                <label className="label"><span className="label-text">Departemen</span></label>
                <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} className="input input-bordered w-full" />
              </div>

              {/* Field Grup */}
              <div className="form-control w-full">
                <label className="select">
                <span className="label">Group</span>
                <select value={groupname} onChange={(e) => setGroupname(e.target.value)}>
                    <option disabled value="">pilih group</option>
                    {groups.map(g => <option key={g.groupname} value={g.groupname}>{g.groupname}</option>)}
                </select>
                </label>
              </div>

              {/* Field Password Baru */}
              <div className="form-control w-full">
                <label className="label"><span className="label-text">Password Baru (Opsional)</span></label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input input-bordered w-full" placeholder="Kosongkan jika tidak ingin diubah" />
              </div>

              {error && <div className="alert alert-error">{error}</div>}

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