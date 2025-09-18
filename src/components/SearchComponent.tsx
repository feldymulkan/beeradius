"use client";

import { useState, useEffect, useCallback } from 'react';

interface SearchComponentProps {
  model: string; // misal: 'users' atau 'products'
  searchPlaceholder: string;
  onResults: (results: any[]) => void; // Callback untuk mengirim hasil ke parent
}

export default function SearchComponent({ model, searchPlaceholder, onResults }: SearchComponentProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Gunakan useCallback agar fungsi fetch tidak dibuat ulang terus-menerus
  const performSearch = useCallback((searchQuery: string) => {
    if (searchQuery) {
      setIsLoading(true);
      fetch(`/api/search?model=${model}&q=${searchQuery}`)
        .then(res => res.json())
        .then(data => {
          onResults(data.results || []);
        })
        .finally(() => setIsLoading(false));
    } else {
      onResults([]);
    }
  }, [model, onResults]);

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 500); // Debouncing

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={searchPlaceholder}
        className="w-full px-3 py-2 border rounded-md text-white"
      />
      {isLoading && <p className="mt-2 text-sm">Mencari...</p>}
    </div>
  );
}