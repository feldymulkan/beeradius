"use client"; // Halaman ini memerlukan state untuk hasil pencarian

import { useState } from 'react';
import SearchComponent from '@/components/SearchComponent';

// Tipe data untuk hasil pencarian user
interface UserResult {
  username: string;
  groupname: string;
}

export default function SearchUsersPage() {
  const [userResults, setUserResults] = useState<UserResult[]>([]);

  return (
    <main className="container mx-auto p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Pencarian Pengguna</h1>
        
        <SearchComponent
          model="users"
          searchPlaceholder="Ketik username untuk mencari..."
          onResults={(results) => setUserResults(results)}
        />
        
        <div className="mt-6">
          <ul className="divide-y divide-gray-200">
            {userResults.map((user) => (
              <li key={user.username} className="py-3">
                <p className="font-medium text-lg">{user.username}</p>
                <p className="text-sm text-gray-500">Grup: {user.groupname}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}