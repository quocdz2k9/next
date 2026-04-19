"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react"; // Thêm icon cho ngầu

export default function AdminLogin() {
  const [key, setKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!key) return toast.error("Vui lòng nhập mã bảo mật!");
    
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ key }),
      });

      if (res.ok) {
        toast.success("Đăng nhập thành công!");
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        toast.error("Sai mã bảo mật!");
      }
    } catch (error) {
      toast.error("Lỗi kết nối hệ thống!");
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xử lý nhấn phím Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-4 font-sans">
      <Card className="w-full max-w-md p-10 rounded-[32px] shadow-2xl border-none bg-white dark:bg-zinc-900 overflow-hidden relative">
        {/* Trang trí một chút viền cam phía trên */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#f58220]" />

        <div className="text-center mb-10">
          <div className="inline-flex p-3 bg-[#f58220]/10 rounded-2xl mb-4 text-[#f58220]">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter mb-2 italic">
            <span className="text-[#f58220]">JOY</span>ADMIN
          </h1>
          <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest italic">
            Hệ thống quản trị bảo mật
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Nhập mã truy cập..."
              className="rounded-2xl h-14 bg-zinc-50 dark:bg-zinc-950 border-none font-bold text-center text-lg focus:ring-2 focus:ring-[#f58220]/20 transition-all"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              onKeyDown={handleKeyDown} // Thêm bắt sự kiện Enter
              disabled={isLoading}
              autoFocus
            />
          </div>

          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full h-14 bg-[#f58220] hover:bg-[#e0761d] text-white font-black rounded-2xl shadow-xl shadow-[#f58220]/20 transition-all active:scale-95 uppercase italic tracking-tighter"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "TRUY CẬP HỆ THỐNG"
            )}
          </Button>
        </div>

        <p className="mt-10 text-center text-[9px] text-zinc-400 font-bold uppercase italic tracking-tighter">
          Powered by <span className="text-[#f58220]">Trần Minh Quốc</span>
        </p>
      </Card>
    </div>
  );
}

