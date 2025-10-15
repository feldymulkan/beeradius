"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <div className="navbar bg-base-200 shadow-md">
      <div className="flex-1">
        {/* ---- INI BAGIAN YANG DITAMBAHKAN ---- */}
        <label
          htmlFor="my-drawer-2"
          className="btn btn-ghost drawer-button lg:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </label>
        {/* -------------------------------------- */}

        <Link href="/" className="btn btn-ghost text-xl">
          Beeradius
        </Link>
      </div>
      <div className="flex-none gap-2">
        <ThemeSwitcher />
        {session?.user && (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full bg-primary text-primary-content">
                <span className="text-xl">
                  {session.user.name?.charAt(0).toUpperCase()}
                </span>
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
              <li>
                <a href="/settings/admin">Pengaturan</a>
              </li>
              <li>
                <button onClick={() => signOut({ callbackUrl: "/login" })}>
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