"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Trash2, Save, Loader2, Settings2, UploadCloud, ImageIcon, X } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [footerLines, setFooterLines] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        setLogoUrl(data.logoUrl || "");
        setFooterLines(data.footerLines || []);
      })
      .catch(() => toast.error("Không thể tải cấu hình"));
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("files", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const result = await res.json();
      if (res.ok) {
        setLogoUrl(`/uploads/${result.filenames[0]}`);
        toast.success("Đã tải logo mới!");
      }
    } catch (error) {
      toast.error("Lỗi upload ảnh");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logoUrl, footerLines }),
      });
      if (res.ok) toast.success("Cấu hình đã được lưu!");
    } catch {
      toast.error("Lỗi kết nối");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 font-sans animate-in fade-in duration-500">
      <div className="flex items-center gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-8">
        <div className="w-14 h-14 bg-gradient-to-br from-[#f58220] to-[#ff9d4d] rounded-[20px] flex items-center justify-center shadow-lg shadow-[#f58220]/30">
            <Settings2 className="text-white" size={28} />
        </div>
        <div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter text-zinc-800 dark:text-zinc-100">Cài đặt Website</h1>
            <p className="text-[10px] font-bold text-zinc-400 uppercase italic tracking-widest">Quản lý nhận diện thương hiệu và nội dung Footer</p>
        </div>
      </div>

      <Card className="p-10 rounded-[40px] border-none shadow-xl shadow-zinc-200/50 dark:shadow-none bg-white dark:bg-zinc-900 space-y-10">
        {/* LOGO SECTION */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase text-[#f58220] italic ml-1 flex items-center gap-2">
            <ImageIcon size={14} /> Logo chính thức
          </label>
          
          <div 
            className="relative group border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[32px] overflow-hidden bg-zinc-50/50 dark:bg-zinc-950/30 transition-all hover:border-[#f58220]/50"
          >
            {logoUrl ? (
              <div className="p-8 flex flex-col items-center">
                <img src={logoUrl} alt="Logo Preview" className="h-32 object-contain mb-4" />
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-xl font-bold text-[10px] uppercase h-9"
                  >
                    Thay đổi ảnh
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setLogoUrl("")}
                    className="rounded-xl font-bold text-[10px] uppercase h-9 text-red-500 hover:bg-red-50"
                  >
                    <X size={14} className="mr-1" /> Gỡ bỏ
                  </Button>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="py-16 flex flex-col items-center gap-3 cursor-pointer hover:bg-[#f58220]/5"
              >
                <div className="p-4 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                    <UploadCloud className="text-[#f58220]" size={32} />
                </div>
                <div className="text-center">
                    <p className="text-[11px] font-black text-zinc-500 uppercase">Chưa có logo được chọn</p>
                    <p className="text-[9px] text-zinc-400 italic">Khuyến khích ảnh PNG hoặc SVG trong suốt</p>
                </div>
              </div>
            )}
            
            {uploading && (
                <div className="absolute inset-0 bg-white/90 dark:bg-black/90 flex flex-col items-center justify-center">
                    <Loader2 className="animate-spin text-[#f58220] mb-2" />
                    <span className="text-[10px] font-bold uppercase italic text-[#f58220]">Đang xử lý ảnh...</span>
                </div>
            )}
            <input type="file" className="hidden" ref={fileInputRef} onChange={handleUpload} accept="image/*" />
          </div>
        </div>

        {/* FOOTER SECTION */}
        <div className="space-y-5">
          <div className="flex justify-between items-end border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <label className="text-[10px] font-black uppercase text-[#f58220] italic ml-1">Thông tin chân trang</label>
            <Button 
                onClick={() => setFooterLines([...footerLines, ""])} 
                variant="ghost" 
                className="h-8 text-[#f58220] hover:bg-[#f58220]/10 font-black italic text-[10px] uppercase rounded-lg"
            >
              <Plus size={14} className="mr-1" /> Thêm dòng mới
            </Button>
          </div>

          <div className="grid gap-4">
            {footerLines.map((line, index) => (
              <div key={index} className="flex gap-3 group animate-in slide-in-from-right-4 duration-300">
                <Input 
                  value={line} 
                  onChange={(e) => {
                    const newLines = [...footerLines];
                    newLines[index] = e.target.value;
                    setFooterLines(newLines);
                  }} 
                  placeholder={`Nội dung dòng ${index + 1}...`}
                  className="h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border-none font-bold text-sm focus:ring-2 focus:ring-[#f58220]/20"
                />
                <Button 
                    onClick={() => setFooterLines(footerLines.filter((_, i) => i !== index))} 
                    variant="ghost" 
                    className="w-14 h-14 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                >
                  <Trash2 size={20} />
                </Button>
              </div>
            ))}
            {footerLines.length === 0 && (
                <p className="text-center py-6 text-[10px] font-bold text-zinc-400 uppercase italic bg-zinc-50 dark:bg-zinc-950/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
                    Chưa có thông tin footer. Hãy nhấn thêm dòng mới.
                </p>
            )}
          </div>
        </div>

        <div className="pt-4">
            <Button 
            disabled={loading || uploading} 
            onClick={handleSave}
            className="w-full h-18 bg-[#f58220] hover:bg-[#e0761d] rounded-[24px] font-black text-white text-xl shadow-2xl shadow-[#f58220]/30 transition-all active:scale-[0.98] uppercase italic flex gap-3"
            >
            {loading ? <Loader2 className="animate-spin" /> : <Save size={24} />}
            Cập nhật toàn bộ giao diện
            </Button>
            <p className="text-center text-[9px] text-zinc-400 font-bold uppercase italic mt-4 tracking-widest">Hành động này sẽ thay đổi giao diện Header và Footer trên toàn trang web</p>
        </div>
      </Card>
    </div>
  );
}

