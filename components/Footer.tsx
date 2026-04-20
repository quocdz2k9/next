"use client";

import { useEffect, useState } from "react";

interface SettingsData {
  logoUrl: string;
  footerLines: string[];
}

export default function Footer() {
  const [data, setData] = useState<SettingsData | null>(null);

  useEffect(() => {
    // 1. Script chặn copy, chuột phải và kéo thả ảnh
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      // Chặn Ctrl+C, Ctrl+U (xem code), Ctrl+S, F12
      if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'u' || e.key === 's' || e.key === 'a')) || 
        e.key === 'F12'
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    // 2. Tối ưu load: Fetch dữ liệu ngay lập tức
    fetch("/api/settings", { next: { revalidate: 60 } }) // Cache nhẹ để load mượt hơn
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Lỗi lấy dữ liệu Footer:", err));

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Tránh bị "giật" giao diện bằng cách giữ chiều cao cố định khi đang load
  if (!data) return <div className="w-full h-64 bg-[#222]"></div>;

  return (
    <footer 
      className="w-full bg-[#222] text-zinc-400 py-12 px-6 mt-20 font-sans border-t border-white/5 select-none"
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }} // Chặn bôi đen chữ bằng CSS
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        
        {/* Logo - Chặn kéo thả ảnh */}
        <div className="mb-8">
          {data.logoUrl && (
            <img
              src={data.logoUrl}
              alt="Footer Logo"
              onDragStart={(e) => e.preventDefault()} // Chặn kéo ảnh ra ngoài
              className="h-12 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity pointer-events-none"
            />
          )}
        </div>

        {/* Thông tin công ty */}
        <div className="space-y-2 text-xs md:text-sm leading-relaxed max-w-3xl">
          {data.footerLines && data.footerLines.map((line: string, i: number) => (
            <p key={i} className="hover:text-zinc-200 transition-colors font-medium">
              {line}
            </p>
          ))}
        </div>

        <hr className="w-20 border-[#f58220]/30 my-8" />

        {/* Bản quyền & Designer Info */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest">
          <p className="text-zinc-500 italic">
            Website Được Thiết Kế Bởi{" "}
            <a
              href="https://www.facebook.com/tranminhquocreal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-300 hover:text-[#f58220] font-black transition-colors"
            >
              Trần Minh Quốc
            </a>
          </p>

          <div className="flex gap-8">
            <a href="#" className="hover:text-[#f58220] transition-colors">Hỗ trợ</a>
            <a href="#" className="hover:text-[#f58220] transition-colors">Điều khoản</a>
            <a href="#" className="hover:text-[#f58220] transition-colors">Bảo mật</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

