"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Group = {
  groupname: string;
};

export default function CreateUserPage() {
  const router = useRouter();

  // ... (state untuk form Anda tetap sama)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState("cleartext");
  const [groupname, setGroupname] = useState("");
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("");

  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 1. State baru untuk mengontrol modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // ... (useEffect Anda tetap sama)
    async function fetchGroups() {
      try {
        const res = await fetch("/api/radius/groups");
        const data = await res.json();
        const fetchedGroups: Group[] = data.groups || [];
        setGroups(fetchedGroups);
        if (fetchedGroups.length > 0) {
          const hasDefaultGroup = fetchedGroups.some(g => g.groupname === "default");
          setGroupname(hasDefaultGroup ? "default" : fetchedGroups[0].groupname);
        }
      } catch (err) {
        setError("Gagal memuat daftar grup.");
      }
    }
    fetchGroups();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // ... (body request Anda tetap sama)
    const body = { username, password, passwordType, groupname, fullName, department };

    try {
      const res = await fetch("/api/radius/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal membuat user.");
      }

      // 2. Jika sukses, buka modal
      setIsModalOpen(true);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setFullName("");
    setDepartment("");
    setPasswordType("cleartext");
    if (groups.length > 0) {
      const hasDefaultGroup = groups.some(g => g.groupname === "default");
      setGroupname(hasDefaultGroup ? "default" : groups[0].groupname);
    }
  };
  
  // 3. Fungsi untuk menutup modal dan kembali ke halaman users
  const handleCloseModalAndRedirect = () => {
    setIsModalOpen(false);
    router.push("/users");
  };
  const handleRecreate = () => {
    resetForm();
    setIsModalOpen(false);
  };

  return (
    <> {/* Gunakan Fragment agar bisa menaruh modal di luar div utama */}
      <div className="prose lg:prose-xl mb-6">
        <h1>Tambah User Baru</h1>
        <div className="not-prose">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <Link href="/users" className="btn btn-ghost btn-sm self-start">
                ← Kembali ke Daftar User
              </Link>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* ... (Semua field form Anda tetap sama) ... */}
                
                {/* Field Username */}
                <div className="form-control w-full max-w-md">
                    <label className="label">
                    <span className="label-text">Username</span>
                    </label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="input input-bordered w-full" required />
                </div>
                {/* Field Password */}
                <div className="form-control w-full max-w-md">
                    <label className="label">
                    <span className="label-text">Password</span>
                    </label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input input-bordered w-full" required />
                </div>
                <div>
                    <label className="select">
                    <span className="label">Tipe Password</span>
                    <select value={passwordType} onChange={(e) => setPasswordType(e.target.value)} className="select select-bordered">
                        <option value="cleartext">Cleartext</option>
                        <option value="md5">MD5</option>
                        <option value="sha1">SHA1</option>
                    </select>
                    </label>
                </div>

                <div>
                <label className="select">
                    <span className="label">Group</span>
                    <select value={groupname} onChange={(e) => setGroupname(e.target.value)} className="select select-bordered" required>
                    {groups.map(g => (
                        <option key={g.groupname} value={g.groupname}>
                        {g.groupname}
                        </option>
                    ))}
                    </select>
                </label>
                </div>
                {/* Field Nama Lengkap */}
                <div className="form-control w-full max-w-md">
                    <label className="label">
                    <span className="label-text">Nama Lengkap (Opsional)</span>
                    </label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="input input-bordered w-full" />
                </div>
                {/* Field Departemen */}
                <div className="form-control w-full max-w-md">
                    <label className="label">
                    <span className="label-text">Departemen (Opsional)</span>
                    </label>
                    <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} className="input input-bordered w-full" />
                </div>

                {/* Pesan Error (pesan sukses sudah diganti modal) */}
                {error && <div className="alert alert-error">{error}</div>}
                
                {/* Tombol Aksi */}
                <div className="card-actions justify-end pt-4">
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading && <span className="loading loading-spinner"></span>}
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* 4. JSX untuk Modal */}
      <input 
        type="checkbox" 
        id="success-modal" 
        className="modal-toggle" 
        checked={isModalOpen}
        onChange={() => setIsModalOpen(!isModalOpen)} // Memungkinkan penutupan dengan tombol Esc
      />
      <div id="success-modal-backdrop" className="modal modal-bottom sm:modal-middle" role="dialog">
        <div className="modal-box">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-12 w-12 text-success mx-auto mb-4" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h3 className="font-bold text-2xl">Berhasil!</h3>
            <p className="py-4 text-lg">User baru telah berhasil ditambahkan.</p>
          </div>
          <div className="modal-action justify-center">
            <button onClick={handleCloseModalAndRedirect} className="btn btn-primary">
              Kembali ke Daftar User
            </button>
            <button onClick={handleRecreate} className="btn btn-primary">
            Tambah Lagi
            </button>
          </div>
        </div>
      </div>
    </>
  );
}