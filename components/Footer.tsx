"use client";

import { useEffect, useState } from "react";

interface SettingsData {
  logoUrl: string;
  footerLines: string[];
}

export default function Footer() {
  const [data, setData] = useState<SettingsData | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
      })
      .catch((err) => console.error("Lỗi lấy dữ liệu Footer:", err));
  }, []);

  if (!data) return <footer className="w-full h-20 bg-[#222]"></footer>;

  return (
    <footer className="w-full bg-[#222] text-zinc-400 py-12 px-6 mt-20 font-sans border-t border-white/5">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        
        {/* Logo */}
        <div className="mb-8">
          {data.logoUrl && (
            <img 
              src={data.logoUrl} 
              alt="Footer Logo" 
              className="h-12 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity" 
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
          {/* Cập nhật phần này */}
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

