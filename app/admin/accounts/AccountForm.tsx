"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { X, ImageIcon, CheckCircle2, UploadCloud, Loader2, AlignLeft, Trash2, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountFormProps {
  initialData?: any;
  games: any[];
  onCancel: () => void;
}

export default function AccountForm({ initialData, games, onCancel }: AccountFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Quản lý ảnh: gộp ảnh cũ và ảnh vừa upload
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>(initialData?.images || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleImage = (imgPath: string) => {
    setSelectedImages(prev =>
      prev.includes(imgPath) ? prev.filter(i => i !== imgPath) : [...prev, imgPath]
    );
  };

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
        toast.success("Tải ảnh lên thành công!");
        setUploadedFiles(prev => [...result.filenames, ...prev]);
        const newPaths = result.filenames.map((f: string) => `/uploads/${f}`);
        setSelectedImages(prev => [...newPaths, ...prev]);
      } else {
        toast.error(result.error || "Upload thất bại");
      }
    } catch (error) {
      toast.error("Lỗi kết nối server");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (selectedImages.length === 0) return toast.error("Vui lòng chọn ít nhất 1 ảnh!");
    
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const data = {
      id: initialData?.id, // Gửi kèm ID nếu là Edit
      name: formData.get("name"),
      priceNum: 0, 
      priceText: formData.get("priceText"),
      description: formData.get("description"),
      gameId: formData.get("gameId"),
      status: formData.get("status"),
      images: selectedImages,
    };

    try {
      const response = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error();

      toast.success(initialData ? "Đã cập nhật thay đổi!" : "Đã đăng tài khoản mới!");
      window.location.reload();
      onCancel();
    } catch (error) {
      toast.error("Lỗi lưu vào Database!");
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async () => {
    if (!initialData?.id) return;
    if (!confirm(`Bạn có chắc muốn xóa tài khoản "${initialData.name}"?`)) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/accounts?id=${initialData.id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Đã xóa tài khoản!");
        window.location.reload();
      } else {
        toast.error("Không thể xóa!");
      }
    } catch (error) {
      toast.error("Lỗi kết nối!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[32px] p-8 mb-8 shadow-sm animate-in fade-in slide-in-from-top-4">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#f58220]/10 rounded-2xl flex items-center justify-center">
                <Tag className="text-[#f58220]" size={20} />
            </div>
            <h2 className="text-xl font-black italic uppercase text-[#f58220] tracking-tighter">
            {initialData ? "Chỉnh sửa tài khoản" : "Đăng Acc Mới"}
            </h2>
        </div>
        <div className="flex items-center gap-2">
          {initialData && (
            <Button type="button" variant="ghost" onClick={handleDelete} className="text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-2xl h-12 px-4 font-bold transition-all">
              <Trash2 size={20} className="mr-2" /> XÓA ACC
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onCancel} className="rounded-full bg-zinc-100 dark:bg-zinc-800">
            <X size={20} />
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 ml-1 italic">Tên sản phẩm</label>
            <Input name="name" defaultValue={initialData?.name} required className="rounded-2xl bg-zinc-50 dark:bg-zinc-950 border-none h-14 font-bold text-base" placeholder="VD: Liên Quân Rank Thách Đấu..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-400 ml-1 italic">Giá hiển thị</label>
              <Input name="priceText" defaultValue={initialData?.priceText} required className="rounded-2xl bg-zinc-50 dark:bg-zinc-950 border-none h-12 font-bold" placeholder="500k, 1M2..." />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-400 ml-1 italic">Loại Game</label>
              <select name="gameId" defaultValue={initialData?.gameId} className="w-full h-12 px-4 bg-zinc-50 dark:bg-zinc-950 border-none rounded-2xl text-sm outline-none font-bold">
                {games.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-400 ml-1 italic">Trạng thái kho hàng</label>
              <select name="status" defaultValue={initialData?.status || "conhang"} className={cn(
                "w-full h-12 px-4 border-none rounded-2xl text-sm outline-none font-black uppercase italic",
                "bg-zinc-50 dark:bg-zinc-950"
              )}>
                <option value="conhang" className="text-green-500">✅ CÒN HÀNG</option>
                <option value="hethang" className="text-red-500">❌ HẾT HÀNG</option>
              </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 ml-1 italic flex items-center gap-2">
              <AlignLeft size={12} /> Thông tin mô tả
            </label>
            <textarea
              name="description"
              defaultValue={initialData?.description}
              required
              className="w-full h-40 p-4 bg-zinc-50 dark:bg-zinc-950 border-none rounded-2xl text-sm outline-none resize-none font-medium focus:ring-2 focus:ring-[#f58220]/20"
              placeholder="Nhập thông tin acc: Rank, Skin, Tướng..."
            />
          </div>

          <Button disabled={loading} className="w-full bg-[#f58220] hover:bg-[#e0761d] h-16 rounded-2xl font-black text-white shadow-xl shadow-[#f58220]/20 transition-all active:scale-95 text-lg uppercase italic">
            {loading ? <Loader2 className="animate-spin mr-2" /> : initialData ? "LƯU THAY ĐỔI" : "ĐĂNG BÁN NGAY"}
          </Button>
        </div>

        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black uppercase text-zinc-400 ml-1 italic flex items-center gap-2">
              <ImageIcon size={14} /> Album hình ảnh
            </label>
            <span className="text-[10px] font-black text-[#f58220] bg-[#f58220]/10 px-3 py-1 rounded-full italic uppercase">Đã chọn: {selectedImages.length}</span>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[32px] p-12 flex flex-col items-center justify-center bg-zinc-50/50 dark:bg-zinc-950/30 cursor-pointer hover:bg-[#f58220]/5 hover:border-[#f58220]/40 transition-all group"
          >
            {uploading ? (
              <Loader2 className="animate-spin text-[#f58220]" size={40} />
            ) : (
              <>
                <div className="p-4 bg-white dark:bg-zinc-800 rounded-3xl shadow-sm mb-4 group-hover:scale-110 transition-all duration-500">
                  <UploadCloud className="text-[#f58220]" size={40} />
                </div>
                <p className="text-xs font-black text-zinc-500 uppercase tracking-widest">Chọn ảnh từ máy</p>
                <p className="text-[10px] text-zinc-400 mt-1 italic uppercase">Chấp nhận JPG, PNG, WEBP</p>
              </>
            )}
            <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleUpload} />
          </div>

          <div className="grid grid-cols-3 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {/* Logic gộp ảnh: Lấy tất cả ảnh từ selectedImages (bao gồm ảnh cũ của acc và ảnh mới up) */}
            {[...new Set([...selectedImages])].map((imgPath) => (
              <div
                key={imgPath}
                onClick={() => toggleImage(imgPath)}
                className={cn(
                  "relative aspect-video rounded-2xl overflow-hidden cursor-pointer transition-all border-4",
                  selectedImages.includes(imgPath) 
                    ? "border-[#f58220] scale-95 shadow-lg shadow-[#f58220]/10" 
                    : "border-transparent opacity-40 hover:opacity-100"
                )}
              >
                <img src={imgPath} className="w-full h-full object-cover" alt="preview" />
                {selectedImages.includes(imgPath) && (
                  <div className="absolute top-2 right-2 scale-110">
                    <CheckCircle2 className="text-white fill-[#f58220]" size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}

