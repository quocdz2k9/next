"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Edit3, Plus } from "lucide-react";
import AccountForm from "./AccountForm";

interface AdminAccountsClientProps {
  initialAccounts: any[];
  games: any[];
  availableFiles: any[];
}

export default function AdminAccountsClient({ initialAccounts, games, availableFiles }: AdminAccountsClientProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingAcc, setEditingAcc] = useState<any>(null);

  const handleEdit = (acc: any) => {
    setEditingAcc(acc);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter italic uppercase text-zinc-800 dark:text-zinc-100">
            Kho Tài Khoản
          </h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1 italic">
            Quản lý kho hàng & Giao dịch hệ thống
          </p>
        </div>

        {!showForm && (
          <Button
            onClick={() => { setEditingAcc(null); setShowForm(true); }}
            className="bg-[#f58220] hover:bg-[#e0761d] rounded-2xl h-14 px-8 font-black gap-2 transition-all active:scale-95 shadow-xl shadow-[#f58220]/20 uppercase italic"
          >
            <Plus size={20} strokeWidth={3} /> ĐĂNG ACC MỚI
          </Button>
        )}
      </div>

      {showForm && (
        <AccountForm
          initialData={editingAcc}
          games={games}
          availableFiles={availableFiles}
          onCancel={() => setShowForm(false)}
        />
      )}

      <Card className="rounded-[32px] border-none shadow-2xl shadow-zinc-200/50 dark:shadow-none overflow-hidden bg-white dark:bg-zinc-900">
        <Table>
          <TableHeader className="bg-zinc-50/50 dark:bg-zinc-800/50 h-16">
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="font-black text-[10px] uppercase pl-8 tracking-widest text-zinc-400">Sản phẩm</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-zinc-400">Danh mục</TableHead>
              <TableHead className="font-black text-[10px] uppercase tracking-widest text-zinc-400">Giá bán</TableHead>
              <TableHead className="font-black text-[10px] uppercase text-right pr-8 tracking-widest text-zinc-400">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialAccounts.map((acc: any) => (
              <TableRow key={acc.id} className="border-zinc-100 dark:border-zinc-800 h-24 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors group">
                <TableCell className="pl-8">
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-12 rounded-xl overflow-hidden shadow-md border border-zinc-100 dark:border-zinc-800">
                        <img src={acc.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                    </div>
                    <div className="font-bold text-sm truncate max-w-[200px] text-zinc-700 dark:text-zinc-200">{acc.name}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-[9px] font-black bg-[#f58220]/10 text-[#f58220] px-3 py-1.5 rounded-lg uppercase italic">
                    {acc.game?.name || "N/A"}
                  </span>
                </TableCell>
                <TableCell className="text-[#f58220] font-black italic text-lg tracking-tighter">
                    {acc.priceText || `${acc.price?.toLocaleString()}đ`}
                </TableCell>
                <TableCell className="text-right pr-8">
                  <div className="flex justify-end gap-2">
                    <Button onClick={() => handleEdit(acc)} variant="ghost" size="icon" className="h-11 w-11 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-2xl transition-all">
                      <Edit3 size={18} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-11 w-11 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all" onClick={() => confirm("Bạn có chắc muốn xóa tài khoản này?")}>
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {initialAccounts.length === 0 && (
            <div className="py-20 text-center">
                <p className="text-[10px] font-bold text-zinc-400 uppercase italic tracking-widest">Hiện chưa có tài khoản nào trong kho</p>
            </div>
        )}
      </Card>
    </>
  );
}

