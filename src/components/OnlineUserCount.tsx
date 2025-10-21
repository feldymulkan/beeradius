"use client";

import { useState, useEffect } from "react";

// Atur seberapa sering data di-refresh (misalnya, setiap 10 detik)
const POLLING_INTERVAL = 10000; // 10 detik dalam milidetik

export default function OnlineUserCount() {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOnlineUsers = async () => {
    try {
      const res = await fetch('/api/radius/online-users');
      if (!res.ok) throw new Error("Gagal fetch data");
      const data = await res.json();
      setCount(data.onlineCount);
    } catch (error) {
      console.error(error);
      setCount(0); // Set ke 0 jika terjadi error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 1. Ambil data saat komponen pertama kali dimuat
    fetchOnlineUsers();

    // 2. Atur interval untuk mengambil data secara berkala (polling)
    const intervalId = setInterval(fetchOnlineUsers, POLLING_INTERVAL);

    // 3. Bersihkan interval saat komponen tidak lagi ditampilkan
    return () => clearInterval(intervalId);
  }, []);

  // Tampilkan UI (Anda bisa ganti style-nya)
  return (
    <div className="stat">
      <div className="stat-figure text-success">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
      </div>
      <div className="stat-title">User Online</div>
      <div className="stat-value text-success">
        {isLoading ? <span className="loading loading-spinner"></span> : count}
      </div>
    </div>
  );
}