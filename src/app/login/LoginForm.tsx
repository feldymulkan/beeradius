"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
// --- 1. TAMBAHKAN IMPOR INI ---
import ThemeSwitcher from "@/components/ThemeSwitcher"; 
// (Asumsi path-nya benar, sesuaikan jika perlu)

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });
    if (result?.error) {
      setError("Username atau password salah!");
    } else if (result?.ok) {
      router.push("/");
    }
  };

  return (
    // Tambahkan 'relative' agar 'absolute' di bawah berfungsi
    <div className="hero min-h-screen bg-base-200 relative">
      {/* --- 2. TAMBAHKAN THEME SWITCHER DI SINI --- */}
      {/* Ini akan menempatkannya di pojok kanan atas layar */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeSwitcher />
      </div>
      {/* ------------------------------------------- */}

      <div className="hero-content w-full max-w-sm">
        <div className="card bg-base-100 w-full shrink-0 shadow-2xl">
          <form className="card-body" onSubmit={handleSubmit}>
            <h1 className="text-2xl font-bold text-center">Beeradius</h1>
            <div className="form-control">
              <label className="label"><span className="label-text">Username</span></label>
              <input
                type="text"
                className="input input-bordered"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Password</span></label>
              <input
                type="password"
                className="input input-bordered"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-error text-sm">{error}</p>}
            <div className="form-control mt-4 text-center">
              <button type="submit" className="btn btn-primary">Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}