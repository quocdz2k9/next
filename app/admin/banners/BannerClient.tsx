"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { X, UploadCloud, Plus, Trash2, Loader2, Image as ImageIcon } from "lucide-react";

export default function BannerClient({ initialBanners }: { initialBanners: any[] }) {
  const [banners, setBanners] = useState(initialBanners);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [selectedImage, setSelectedImage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        setSelectedImage(`/uploads/${result.filenames[0]}`);
        toast.success("Đã tải ảnh banner lên!");
      }
    } catch (error) {
      toast.error("Lỗi upload ảnh");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedImage) return toast.error("Vui lòng chọn ảnh!");

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      imageUrl: selectedImage
    };

    try {
      const res = await fetch("/api/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        toast.success("Thêm banner thành công!");
        window.location.reload();
      }
    } catch (error) {
      toast.error("Lỗi lưu banner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">Quản lý Banners</h1>
          <p className="text-zinc-500 text-xs font-bold italic uppercase">Ảnh bìa trang chủ & Quảng cáo</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="bg-[#f58220] hover:bg-[#e0761d] rounded-2xl h-12 font-black">
            <Plus size={20} className="mr-2" /> THÊM BANNER
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="p-6 rounded-[32px] border-none shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-black italic text-[#f58220]">TẠO BANNER MỚI</h2>
            <Button variant="ghost" size="icon" onClick={() => setShowForm(false)} className="rounded-full">
              <X size={20} />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-400 italic ml-1">Tiêu đề Banner (Không bắt buộc)</label>
                <Input name="title" className="h-12 rounded-2xl bg-zinc-50 border-none" placeholder="Ví dụ: Sự kiện Tết 2026..." />
              </div>
              
              <Button disabled={loading} className="w-full h-14 bg-[#f58220] rounded-2xl font-black text-lg">
                {loading ? <Loader2 className="animate-spin mr-2" /> : "XÁC NHẬN LƯU BANNER"}
              </Button>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-zinc-400 italic ml-1">Hình ảnh Banner</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative aspect-[21/9] border-2 border-dashed border-zinc-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-50 transition-all overflow-hidden"
              >
                {selectedImage ? (
                  <img src={selectedImage} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <>
                    {uploading ? <Loader2 className="animate-spin text-[#f58220]" size={32} /> : <UploadCloud size={32} className="text-zinc-300" />}
                    <p className="text-[10px] font-bold text-zinc-400 mt-2">CLICK ĐỂ TẢI ẢNH</p>
                  </>
                )}
              </div>
              <input type="file" className="hidden" ref={fileInputRef} onChange={handleUpload} accept="image/*" />
            </div>
          </form>
        </Card>
      )}

      <Card className="rounded-[32px] border-none shadow-sm overflow-hidden bg-white dark:bg-zinc-900">
        <Table>
          <TableHeader className="bg-zinc-50/50 h-14">
            <TableRow className="border-none">
              <TableHead className="pl-6 font-black text-[10px] uppercase">Hình ảnh</TableHead>
              <TableHead className="font-black text-[10px] uppercase">Tiêu đề</TableHead>
              <TableHead className="font-black text-[10px] uppercase text-right pr-6">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banners.map((b) => (
              <TableRow key={b.id} className="h-24 border-zinc-100 dark:border-zinc-800">
                <TableCell className="pl-6">
                  <img src={b.imageUrl} className="w-40 h-16 rounded-xl object-cover border border-zinc-100" />
                </TableCell>
                <TableCell className="font-bold text-sm">{b.title || <span className="text-zinc-300 italic">Không có tiêu đề</span>}</TableCell>
                <TableCell className="text-right pr-6">
                  <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-red-500 rounded-xl">
                    <Trash2 size={18} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

