"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import ThemeSwitcher from "./ThemeSwitcher"; // Komponen ganti tema dari sebelumnya

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <div className="navbar bg-base-100 shadow-md">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl">
          Beeradius
        </Link>
      </div>
      <div className="flex-none gap-2">
        <ThemeSwitcher />
        {session?.user && (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full bg-primary text-primary-content">
                {/* Ambil huruf pertama dari username */}
                <span className="text-xl">{session.user.name?.charAt(0).toUpperCase()}</span>
              </div>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <a className="justify-between">
                  Profil
                  <span className="badge">Baru</span>
                </a>
              </li>
              <li><a>Pengaturan</a></li>
              <li>
                <button onClick={() => signOut({ callbackUrl: '/login' })}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}