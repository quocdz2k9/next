"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";

interface AccountFormProps {
  initialData?: any;
  games: any;
  availableFiles: any;
  onCancel: () => void;
}

export default function AccountForm({ initialData, games, availableFiles, onCancel }: AccountFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialData || {
    name: "",
    gameId: "",
    price: "",
    images: [],
    description: ""
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Giả lập lưu dữ liệu
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(initialData ? "Cập nhật thành công!" : "Đã đăng tài khoản mới!");
      onCancel();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lưu!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-8 rounded-[32px] border-none shadow-xl bg-white dark:bg-zinc-900 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-black uppercase italic tracking-tighter text-zinc-800 dark:text-zinc-100">
          {initialData ? "Chỉnh sửa tài khoản" : "Đăng tài khoản mới"}
        </h2>
        <Button variant="ghost" onClick={onCancel} className="rounded-full w-10 h-10 p-0 hover:bg-zinc-100 dark:hover:bg-zinc-800">
          <X size={20} />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase text-[#f58220] italic ml-1 tracking-widest">Tên sản phẩm</label>
          <Input 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-none font-bold text-zinc-700 dark:text-zinc-200 focus:ring-2 focus:ring-[#f58220]/20 transition-all" 
            placeholder="Ví dụ: Acc Đột Kích cực phẩm..."
          />
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase text-[#f58220] italic ml-1 tracking-widest">Danh mục Game</label>
          <select 
            value={formData.gameId}
            onChange={(e) => setFormData({...formData, gameId: e.target.value})}
            className="w-full h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-none font-bold text-zinc-700 dark:text-zinc-200 px-4 focus:ring-2 focus:ring-[#f58220]/20 outline-none appearance-none"
          >
            <option value="">Chọn Game...</option>
            {games?.map((game: any) => (
              <option key={game.id} value={game.id}>{game.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase text-[#f58220] italic ml-1 tracking-widest">Giá bán (VNĐ)</label>
          <Input 
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            className="h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-none font-black text-[#f58220] text-xl" 
            placeholder="0"
          />
        </div>
        
        {/* Bạn có thể thêm các field file/hình ảnh ở đây sử dụng availableFiles */}
      </div>

      <div className="mt-10 flex flex-col md:flex-row gap-4">
        <Button 
          disabled={loading}
          onClick={handleSubmit}
          className="flex-1 h-14 bg-[#f58220] hover:bg-[#e0761d] rounded-2xl font-black text-white shadow-xl shadow-[#f58220]/20 transition-all active:scale-95 uppercase italic"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save className="mr-2" size={20} />}
          LƯU THÔNG TIN HỆ THỐNG
        </Button>
        <Button variant="outline" onClick={onCancel} className="h-14 px-10 rounded-2xl font-bold uppercase tracking-widest border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">
          HỦY BỎ
        </Button>
      </div>
    </Card>
  );
}

