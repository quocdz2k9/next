"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Gamepad2,
  CreditCard,
  Image as ImageIcon,
  Settings, // Thêm icon Settings
  LogOut,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const menuItems = [
    { name: "Tổng quan", icon: LayoutDashboard, href: "/admin/dashboard" },
    { name: "Quản lý Game", icon: Gamepad2, href: "/admin/games" },
    { name: "Quản lý Account", icon: CreditCard, href: "/admin/accounts" },
    { name: "Quản lý Banner", icon: ImageIcon, href: "/admin/banners" },
    { name: "Cài đặt Web", icon: Settings, href: "/admin/settings" }, // Thêm mục Settings ở đây
  ];

  const NavLinks = ({ isMobile = false }) => (
    <nav className={cn("space-y-1.5", isMobile ? "px-4 pb-6" : "")}>
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl font-semibold transition-all duration-200",
              isActive
                ? "bg-[#f58220] text-white shadow-md shadow-[#f58220]/20"
                : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-[#f58220]"
            )}
          >
            <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-black font-sans">
      {/* MOBILE NAV */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-[100]">
        {/* Header Bar */}
        <div className="h-16 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 px-4 flex items-center justify-between relative z-[102] shadow-sm">
          <div className="text-xl font-black tracking-tighter">
            <span className="text-[#f58220]">JOY</span>ADMIN
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Dropdown Menu trượt xuống */}
        <div className={cn(
          "absolute left-0 right-0 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 shadow-2xl transition-all duration-300 ease-in-out z-[101]",
          isOpen
            ? "top-16 opacity-100 visible"
            : "top-[-100%] opacity-0 invisible"
        )}>
          <div className="pt-4">
            <NavLinks isMobile />
            <div className="px-4 pb-4 mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <Link
                href="/admin/login"
                className="flex items-center gap-3 p-3 rounded-xl font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
              >
                <LogOut size={20} />
                Đăng xuất
              </Link>
            </div>
          </div>
        </div>

        {/* Overlay mờ phía sau */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[99]"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="text-2xl font-black mb-10 tracking-tighter text-[#f58220]">
          JOYADMIN
        </div>
        <div className="flex-1">
          <NavLinks />
        </div>
        <Link
          href="/admin/login"
          className="flex items-center gap-3 p-3 rounded-xl font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors mt-auto"
        >
          <LogOut size={20} />
          Đăng xuất
        </Link>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-10 mt-16 md:mt-0 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

