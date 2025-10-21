"use client";

import { useEffect, useState } from "react";

const THEME_KEY = "theme"; // Key yang dipakai di localStorage
const FALLBACK_THEME = "dark"; // Tema default jika tidak ada

export default function ThemeSwitcher() {
  // 1. Mulai dengan state 'null' untuk mencegah icon yang salah
  const [theme, setTheme] = useState<string | null>(null);

  // 2. Saat komponen dimuat di KLIEN, baca tema dari localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY) || FALLBACK_THEME;
    setTheme(savedTheme);
  }, []); // '[]' = hanya berjalan sekali saat mount

  // 3. Saat state 'theme' berubah, perbarui <html> dan localStorage
  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem(THEME_KEY, theme);
    }
  }, [theme]); // Berjalan setiap 'theme' berubah

  const handleThemeChange = () => {
    // 4. Ganti temanya
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  // 5. Jangan tampilkan tombolnya sampai tema selesai dimuat
  // Ini mencegah "flash" icon yang salah
  if (theme === null) {
    return <div className="skeleton btn btn-ghost btn-circle w-12 h-12"></div>;
  }

  return (
    <button onClick={handleThemeChange} className="btn btn-ghost btn-circle">
      {/* Ikon bulan dan matahari (logika Anda sudah benar) */}
      {theme === 'light' ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
      )}
    </button>
  );
}