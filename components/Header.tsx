"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Home } from "lucide-react";

export default function Header() {
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy dữ liệu logo
    fetch("/api/settings")
      .then((res) => res.json())
      .then((json) => {
        if (json.logoUrl) setLogoUrl(json.logoUrl);
      })
      .catch((err) => console.error("Lỗi lấy dữ liệu Header:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full mb-8 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-200 dark:border-white/10 font-sans shadow-sm select-none">
      <div className="max-w-6xl mx-auto flex justify-between items-center py-3 px-4 md:px-6">
        
        {/* Logo - Giữ khung cố định để load mượt */}
        <Link href="/" className="group flex items-center min-w-[100px] min-h-[32px] md:min-h-[40px]">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Logo"
              onDragStart={(e) => e.preventDefault()} // Chặn kéo ảnh
              className="h-8 md:h-10 w-auto object-contain transition-all group-hover:scale-105 active:scale-95 pointer-events-none"
            />
          ) : (
            // Hiện một khung mờ nhẹ khi đang load để không bị trống
            loading && <div className="h-8 w-24 bg-zinc-200/50 dark:bg-zinc-800/50 animate-pulse rounded-md" />
          )}
        </Link>

        {/* Nút Trang Chủ */}
        <div className="flex items-center">
          <Link href="/">
            <button className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 md:px-6 md:py-2.5 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-widest hover:bg-[#f58220] dark:hover:bg-[#f58220] hover:text-white transition-all active:scale-95 shadow-lg">
              <Home size={14} strokeWidth={3} />
              <span className="hidden sm:inline">Trang chủ</span>
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}

