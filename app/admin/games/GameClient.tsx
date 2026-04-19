"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { X, UploadCloud, Plus, Trash2, Loader2, Gamepad2, Image as ImageIcon } from "lucide-react";

export default function GameClient({ initialGames }: { initialGames: any[] }) {
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Chỉ lưu trữ ảnh mới upload trong phiên này
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Xử lý upload logo
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const result = await res.json();
      if (res.ok) {
        const newPaths = result.filenames.map((f: string) => `/uploads/${f}`);
        setSelectedImages(prev => [...newPaths, ...prev]);
        toast.success("Đã tải logo lên!");
      }
    } catch (error) {
      toast.error("Lỗi upload logo");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Xử lý thêm Game mới
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedImages.length === 0) return toast.error("Vui lòng tải logo lên!");

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      images: selectedImages
    };

    try {
      const res = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        toast.success("Thêm danh mục game thành công!");
        window.location.reload();
      } else {
        toast.error("Lỗi khi tạo game");
      }
    } catch (error) {
      toast.error("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý Xóa Game
  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa game "${name}"? Thao tác này sẽ bị lỗi nếu vẫn còn tài khoản thuộc game này.`)) return;

    try {
      const res = await fetch(`/api/games?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success(`Đã xóa game ${name}`);
        window.location.reload();
      } else {
        const err = await res.json();
        toast.error(err.error || "Không thể xóa danh mục này");
      }
    } catch (error) {
      toast.error("Lỗi khi kết nối API");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">Danh Mục Game</h1>
          <p className="text-zinc-500 text-xs font-bold italic uppercase">Quản lý các loại game đang kinh doanh</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="bg-[#f58220] hover:bg-[#e0761d] rounded-2xl h-12 font-black shadow-lg shadow-[#f58220]/20 transition-all active:scale-95">
            <Plus size={20} className="mr-2" /> THÊM GAME MỚI
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="p-6 rounded-[32px] border-none shadow-sm bg-white dark:bg-zinc-900 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-black italic text-[#f58220] flex items-center gap-2 uppercase">
              <Gamepad2 size={20} /> Thiết lập game mới
            </h2>
            <Button variant="ghost" size="icon" onClick={() => setShowForm(false)} className="rounded-full">
              <X size={20} />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-400 italic ml-1">Tên danh mục Game</label>
                <Input name="name" required className="h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border-none font-bold focus:ring-2 focus:ring-[#f58220]/20" placeholder="Liên Quân, Free Fire, Valorant..." />
              </div>
              
              <Button disabled={loading} className="w-full h-14 bg-[#f58220] hover:bg-[#e0761d] rounded-2xl font-black text-lg shadow-lg shadow-[#f58220]/20 transition-all active:scale-95">
                {loading ? <Loader2 className="animate-spin mr-2" /> : "LƯU THÔNG TIN"}
              </Button>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-zinc-400 italic ml-1 text-right block">Ảnh bìa / Logo danh mục</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative aspect-video border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-[#f58220]/5 hover:border-[#f58220]/50 transition-all overflow-hidden bg-zinc-50/30 dark:bg-zinc-950/30"
              >
                {selectedImages.length > 0 ? (
                  <div className="w-full h-full relative group">
                    <img src={selectedImages[selectedImages.length - 1]} className="w-full h-full object-cover" alt="Preview" />
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <UploadCloud className="text-white mb-2" size={32} />
                       <span className="text-white text-[10px] font-bold uppercase">Thay đổi ảnh khác</span>
                    </div>
                  </div>
                ) : (
                  <>
                    {uploading ? <Loader2 className="animate-spin text-[#f58220]" size={32} /> : <UploadCloud size={32} className="text-zinc-300" />}
                    <p className="text-[10px] font-bold text-zinc-400 mt-2 uppercase tracking-widest text-center px-4">Click để tải lên ảnh đại diện Game</p>
                  </>
                )}
              </div>
              <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleUpload} accept="image/*" />
            </div>
          </form>
        </Card>
      )}

      <Card className="rounded-[32px] border-none shadow-sm overflow-hidden bg-white dark:bg-zinc-900">
        <Table>
          <TableHeader className="bg-zinc-50/50 dark:bg-zinc-800/50 h-14">
            <TableRow className="border-none">
              <TableHead className="pl-6 font-black text-[10px] uppercase w-[180px]">Hình ảnh</TableHead>
              <TableHead className="font-black text-[10px] uppercase">Tên danh mục</TableHead>
              <TableHead className="font-black text-[10px] uppercase text-center">Tồn kho</TableHead>
              <TableHead className="font-black text-[10px] uppercase text-right pr-6">Quản lý</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialGames.map((g) => (
              <TableRow key={g.id} className="h-20 border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors group">
                <TableCell className="pl-6">
                  <div className="w-20 h-12 rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800 bg-white">
                    {g.images && g.images[0] ? (
                        <img src={g.images[0]} className="w-full h-full object-cover" alt={g.name} />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-400"><ImageIcon size={16}/></div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-black text-sm uppercase italic tracking-tighter text-zinc-800 dark:text-zinc-200">{g.name}</TableCell>
                <TableCell className="text-center">
                  <span className="bg-[#f58220]/10 text-[#f58220] text-[10px] font-black px-3 py-1 rounded-full uppercase italic">
                    {g._count?.accounts || 0} Sản phẩm
                  </span>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(g.id, g.name)}
                    className="text-zinc-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {initialGames.length === 0 && (
            <div className="py-20 text-center">
                <p className="text-zinc-400 text-xs font-bold uppercase italic">Chưa có danh mục game nào được tạo</p>
            </div>
        )}
      </Card>
    </div>
  );
}

