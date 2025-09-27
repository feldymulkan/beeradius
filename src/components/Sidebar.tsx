"use client";

import ActiveLink from "./ActiveLink";

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197" />
  </svg>
);

export default function Sidebar() {
  return (
    <ul className="menu p-4 w-60 min-h-full bg-base-100 text-base-content">
      <li className="menu-title">Menu</li>

      {/* Menu dengan highlight */}
      <li>
        <ActiveLink href="/">
          <HomeIcon />
          Dashboard
        </ActiveLink>
      </li>
      <li>
        <ActiveLink href="/users">
          <UsersIcon />
          Users
        </ActiveLink>
      </li>

      {/* Submenu juga bisa highlight */}
      <li>
        <details>
          <summary>Pengaturan</summary>
          <ul>
            <li>
              <ActiveLink href="/settings/profile">Profil</ActiveLink>
            </li>
            <li>
              <ActiveLink href="/settings/billing">Tagihan</ActiveLink>
            </li>
          </ul>
        </details>
      </li>
    </ul>
  );
}
