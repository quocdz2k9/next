import { PrismaClient } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Edit3, Plus, ExternalLink } from "lucide-react";
import fs from "fs";
import path from "path";
import AdminAccountsClient from "./AdminAccountsClient"; // Tách logic Client ra file riêng nếu cần hoặc gộp chung

const prisma = new PrismaClient();

export default async function AdminAccountsPage() {
  // 1. Lấy dữ liệu từ DB
  const [accounts, games] = await Promise.all([
    prisma.account.findMany({
      include: { game: true },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.game.findMany()
  ]);

  // 2. Đọc danh sách file trong thư mục public/uploads
  const uploadsDir = path.join(process.cwd(), "public/uploads");
  let availableFiles: string[] = [];
  
  if (fs.existsSync(uploadsDir)) {
    availableFiles = fs.readdirSync(uploadsDir).filter(file => 
      /\.(jpg|jpeg|png|webp|gif)$/i.test(file)
    );
  }

  return (
    <div className="space-y-6">
      {/* Component quản lý trạng thái hiển thị Form/Table */}
      <AdminAccountsClient 
        initialAccounts={JSON.parse(JSON.stringify(accounts))} 
        games={games}
        availableFiles={availableFiles}
      />
    </div>
  );
}

