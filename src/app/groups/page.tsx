"use client"; // Halaman ini juga memerlukan state

import { useState } from 'react';
import SearchComponent from '@/components/SearchComponent';

// Tipe data untuk hasil pencarian grup
interface GroupResult {
  groupname: string;
}

export default function SearchGroupsPage() {
  const [groupResults, setGroupResults] = useState<GroupResult[]>([]);

  return (
    <main className="container mx-auto p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Pencarian Grup</h1>

        <SearchComponent
          model="groups"
          searchPlaceholder="Ketik nama grup untuk mencari..."
          onResults={(results) => setGroupResults(results)}
        />
        
        <div className="mt-6">
          <ul className="divide-y divide-gray-200">
            {groupResults.map((group) => (
              <li key={group.groupname} className="py-3">
                <p className="font-medium text-lg">{group.groupname}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}