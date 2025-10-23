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

const GroupIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const ListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

const OnlineIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.556C11.332 13.335 12.668 13.335 15.889 16.556m-11.778-3.535C9.553 10.579 14.447 10.579 17.667 13.021M2.556 9.486c4.667-4.667 11.333-4.667 16 0" />
  </svg>
);

export default function Sidebar() {
  return (
    <ul className="menu p-4 w-60 min-h-full bg-gray-800 text-gray-200">
      <li className="menu-title text-white">Menu</li>

      <li>
        <ActiveLink href="/">
          <HomeIcon />
          Dashboard
        </ActiveLink>
      </li>
      <li>
        <details>
          <summary>
            <UsersIcon />
            Users
          </summary>
          <ul className="menu-dropdown">
            <li>
              <ActiveLink href="/radius-users">
                <ListIcon />
                Daftar User
              </ActiveLink>
            </li>
            <li>
              <ActiveLink href="/radius-users/online">
                <OnlineIcon />
                User Online
              </ActiveLink>
            </li>
          </ul>
        </details>
      </li>

      <li>
        <ActiveLink href="/radius-groups">
          <GroupIcon />
          Groups
        </ActiveLink>
      </li>

      <li>
        <details>
          <summary>Pengaturan</summary>
          <ul className="menu-dropdown">
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