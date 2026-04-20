import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ShoppingCart, CheckCircle, XCircle, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

const prisma = new PrismaClient();

type Props = {
  params: Promise<{ id: string }>;
};

// 1. Component Skeleton để hiển thị khi đang load
function GameSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="h-4 w-40 bg-zinc-200 dark:bg-zinc-800 rounded mb-6" />
      
      {/* Game Info skeleton */}
      <div className="flex items-center gap-4 mb-10 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
        <div className="space-y-2">
          <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
        </div>
      </div>

      {/* Account Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 rounded-3xl h-[350px] border border-zinc-200 dark:border-zinc-800" />
        ))}
      </div>
    </div>
  );
}

// 2. Component chứa nội dung chính (giữ nguyên logic của bạn)
async function GameContent({ id }: { id: string }) {
  const gameId = parseInt(id);
  if (isNaN(gameId)) notFound();

  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: {
      accounts: { orderBy: { createdAt: 'desc' } }
    }
  });

  if (!game) notFound();

  return (
    <div className="animate-in fade-in duration-500">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[11px] sm:text-xs text-zinc-500 mb-6">
        <Link href="/" className="hover:text-[#f58220] transition-colors">Trang chủ</Link>
        <ChevronRight size={12} />
        <span className="text-zinc-900 dark:text-zinc-300 font-medium">{game.name}</span>
      </div>

      {/* Thông tin Game */}
      <div className="flex items-center gap-4 mb-10 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <img
          src={game.images[0] || "https://via.placeholder.com/400x400"}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-md"
          alt={game.name}
        />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white uppercase tracking-tight">
            {game.name}
          </h1>
          <p className="text-zinc-500 text-sm">Kho tài khoản ({game.accounts.length}) uy tín</p>
        </div>
      </div>

      {/* Danh sách Account */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {game.accounts.map((acc) => (
          <Link
            href={`/account/${acc.id}`}
            key={acc.id}
            className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src={acc.images[0]}
                className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                alt={acc.name}
              />
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-full">
                MS: #{acc.id}
              </div>
              <div className={`absolute top-2 right-2 px-2 py-1 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1 shadow-lg ${
                acc.status === 'conhang' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}>
                {acc.status === 'conhang' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                {acc.status === 'conhang' ? 'Còn hàng' : 'Hết hàng'}
              </div>
            </div>

            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 line-clamp-2 mb-2 min-h-[3rem] group-hover:text-[#f58220] transition-colors">
                {acc.name}
              </h3>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase font-bold">Giá bán</p>
                  <p className="text-[#f58220] font-black text-xl">
                    {acc.priceText}
                  </p>
                </div>
                <div className={`p-3 rounded-2xl transition-all ${
                  acc.status === 'conhang'
                    ? 'bg-[#f58220] text-white'
                    : 'bg-zinc-200 text-zinc-400'
                }`}>
                  <ShoppingCart size={20} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {game.accounts.length === 0 && (
        <div className="py-20 text-center">
          <div className="inline-block p-6 bg-zinc-100 dark:bg-zinc-900 rounded-full mb-4 text-zinc-400">
            <ShoppingCart size={48} />
          </div>
          <p className="text-zinc-500 italic">Hiện tại chưa có tài khoản nào.</p>
        </div>
      )}
    </div>
  );
}

// 3. Main Page Component
export default async function GameDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col font-sans">
      <main className="max-w-[1200px] mx-auto w-full p-4 sm:p-8 flex-1">
        <Header />
        <Suspense fallback={<GameSkeleton />}>
          <GameContent id={id} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

