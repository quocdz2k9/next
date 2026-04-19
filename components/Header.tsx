"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Home } from "lucide-react"; // Import icon trang chủ cho đẹp

export default function Header() {
  const [logoUrl, setLogoUrl] = useState<string>("");

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((json) => {
        if (json.logoUrl) {
          setLogoUrl(json.logoUrl);
        }
      })
      .catch((err) => console.error("Lỗi lấy dữ liệu Header:", err));
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full mb-8 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-black font-sans shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center py-3 px-4 md:px-6">
        
        {/* Logo - Căn trái */}
        <Link href="/" className="group flex items-center">
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Logo"
              className="h-8 md:h-10 w-auto object-contain transition-all group-hover:scale-105 active:scale-95"
            />
          )}
        </Link>

        {/* Nút Trang Chủ - Căn phải (Hiển thị trên mọi thiết bị) */}
        <div className="flex items-center">
          <Link href="/">
            <button className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 md:px-6 md:py-2.5 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-widest hover:bg-[#f58220] dark:hover:bg-[#f58220] hover:text-white transition-all active:scale-95 shadow-lg shadow-black/10">
              <Home size={14} strokeWidth={3} />
              <span>Trang chủ</span>
            </button>
          </Link>
        </div>

      </div>
    </header>
  );
}

