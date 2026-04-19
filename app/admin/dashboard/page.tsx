import { PrismaClient } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { 
  Gamepad2, 
  LayoutDashboard, 
  ArrowUpRight, 
  Package, 
  Image as ImageIcon 
} from "lucide-react";
import Link from "next/link";
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export default async function AdminDashboard() {
  const [totalAccounts, totalGames, totalBanners, recentAccounts] = await Promise.all([
    prisma.account.count(),
    prisma.game.count(),
    prisma.banner.count(),
    prisma.account.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { game: true }
    })
  ]);

  const stats = [
    { title: "Tổng Account", value: totalAccounts, icon: Package, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Danh mục Game", value: totalGames, icon: Gamepad2, color: "text-[#f58220]", bg: "bg-[#f58220]/10" },
    { title: "Banner/Ảnh", value: totalBanners, icon: ImageIcon, color: "text-purple-600", bg: "bg-purple-100" }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">Dashboard</h1>
        <p className="text-zinc-500 text-sm">Thống kê hoạt động của shop JoyGames</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="p-6 rounded-3xl border-zinc-200 dark:border-zinc-800 shadow-sm border-none bg-white dark:bg-zinc-900">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="flex items-center text-[10px] font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full uppercase tracking-wider">
                Live <ArrowUpRight size={10} className="ml-1" />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-tight">{stat.title}</h3>
              <p className="text-4xl font-black mt-1 tracking-tighter italic">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card className="lg:col-span-7 rounded-3xl border-none shadow-sm overflow-hidden bg-white dark:bg-zinc-900">
          <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
            <h2 className="font-bold text-lg">Vừa cập nhật</h2>
            <Link href="/admin/accounts" className="text-[11px] bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full font-bold hover:bg-[#f58220] hover:text-white transition-colors">
              XEM TẤT CẢ
            </Link>
          </div>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {recentAccounts.map((acc) => (
              <div key={acc.id} className="p-4 flex items-center gap-4">
                <img src={acc.images[0]} className="w-14 h-10 rounded-xl object-cover bg-zinc-100" alt="" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{acc.name}</p>
                  <p className="text-[11px] text-zinc-400 font-medium uppercase">{acc.game.name} • {acc.priceText}</p>
                </div>
                <div className={cn(
                  "text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border",
                  acc.status === 'conhang' ? "text-green-500 border-green-200 bg-green-50" : "text-red-400 border-red-100 bg-red-50"
                )}>
                  {acc.status === 'conhang' ? 'Sẵn sàng' : 'Đã bán'}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="lg:col-span-5 space-y-6">
          <Card className="p-8 rounded-3xl bg-[#f58220] text-white shadow-xl shadow-[#f58220]/20 relative overflow-hidden border-none">
            <div className="relative z-10">
              <h2 className="text-2xl font-black mb-2 tracking-tighter italic text-white">UP ACC NGAY!</h2>
              <p className="text-white/90 text-sm mb-6 leading-relaxed">Shop đang có lượng truy cập cao, hãy đăng thêm các Acc xịn để tối ưu doanh thu.</p>
              <Link href="/admin/accounts" className="inline-block bg-black text-white px-8 py-3.5 rounded-2xl font-black text-xs hover:bg-white hover:text-black transition-all active:scale-95 shadow-lg">
                ĐĂNG BÁN MỚI
              </Link>
            </div>
            <Package size={140} className="absolute -bottom-10 -right-6 text-white/10 rotate-12" />
          </Card>
        </div>
      </div>
    </div>
  );
}

