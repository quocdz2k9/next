"use client";

import { useEffect } from "react";

interface SettingsData {
  logoUrl: string;
  footerLines: string[];
}

export default function Footer({ initialData }: { initialData: SettingsData }) {
  useEffect(() => {
    // Chặn F12 và bảo mật (Chỉ chạy ở Client)
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && (e.key === 'u' || e.key === 's' || e.key === 'h' || e.key === 'a' || e.key === 'c'))
      ) {
        e.preventDefault();
        return false;
      }
    };

    const devToolsChecker = setInterval(() => {
      const startTime = performance.now();
      debugger;
      const endTime = performance.now();
      if (endTime - startTime > 100) {
        window.location.reload();
      }
    }, 1000);

    const consoleClearer = setInterval(() => {
      console.clear();
    }, 2000);

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      clearInterval(devToolsChecker);
      clearInterval(consoleClearer);
    };
  }, []);

  // Render thẳng bằng initialData từ server truyền xuống, không dùng state
  return (
    <footer
      className="w-full bg-[#222] text-zinc-400 py-12 px-6 font-sans border-t border-white/5 select-none"
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        <div className="mb-8 min-h-[48px]">
          {initialData.logoUrl && (
            <img
              src={initialData.logoUrl}
              alt="Footer Logo"
              onDragStart={(e) => e.preventDefault()}
              className="h-12 w-auto object-contain opacity-90 pointer-events-none"
            />
          )}
        </div>

        <div className="space-y-2 text-xs md:text-sm leading-relaxed max-w-3xl">
          {initialData.footerLines.map((line: string, i: number) => (
            <p key={i} className="font-medium">
              {line}
            </p>
          ))}
        </div>

        <hr className="w-20 border-[#f58220]/30 my-8" />

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
            <span className="cursor-default hover:text-[#f58220] transition-colors">Hỗ trợ</span>
            <span className="cursor-default hover:text-[#f58220] transition-colors">Điều khoản</span>
            <span className="cursor-default hover:text-[#f58220] transition-colors">Bảo mật</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

