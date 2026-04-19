"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Edit3, Plus } from "lucide-react";
import AccountForm from "./AccountForm";

export default function AdminAccountsClient({ initialAccounts, games, availableFiles }: any) {
  const [showForm, setShowForm] = useState(false);
  const [editingAcc, setEditingAcc] = useState<any>(null);

  const handleEdit = (acc: any) => {
    setEditingAcc(acc);
    setShowForm(true);
    window.scrollTo({ top: 0 });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight italic uppercase">Kho Tài Khoản</h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Quản lý kho hàng & Giao dịch</p>
        </div>
        
        {!showForm && (
          <Button 
            onClick={() => { setEditingAcc(null); setShowForm(true); }}
            className="bg-[#f58220] hover:bg-[#e0761d] rounded-2xl h-12 px-6 font-black gap-2 transition-all active:scale-95 shadow-lg shadow-[#f58220]/20"
          >
            <Plus size={20} /> ĐĂNG ACC MỚI
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

      <Card className="rounded-[32px] border-none shadow-sm overflow-hidden bg-white dark:bg-zinc-900">
        <Table>
          <TableHeader className="bg-zinc-50/50 dark:bg-zinc-800/50 h-16">
            <TableRow className="border-none">
              <TableHead className="font-black text-[10px] uppercase pl-6">Sản phẩm</TableHead>
              <TableHead className="font-black text-[10px] uppercase">Danh mục</TableHead>
              <TableHead className="font-black text-[10px] uppercase">Giá bán</TableHead>
              <TableHead className="font-black text-[10px] uppercase text-right pr-6">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialAccounts.map((acc: any) => (
              <TableRow key={acc.id} className="border-zinc-100 dark:border-zinc-800 h-20 hover:bg-zinc-50/50 transition-colors">
                <TableCell className="pl-6">
                  <div className="flex items-center gap-4">
                    <img src={acc.images[0]} className="w-16 h-10 rounded-xl object-cover bg-zinc-100 border border-zinc-200" alt="" />
                    <div className="font-bold text-sm truncate max-w-[200px]">{acc.name}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-[10px] font-black bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md uppercase text-zinc-500">
                    {acc.game.name}
                  </span>
                </TableCell>
                <TableCell className="text-[#f58220] font-black italic">{acc.priceText}</TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex justify-end gap-2">
                    <Button onClick={() => handleEdit(acc)} variant="ghost" size="icon" className="h-10 w-10 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl">
                      <Edit3 size={18} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl" onClick={() => confirm("Xóa acc này?")}>
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}

