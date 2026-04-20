import { PrismaClient } from "@prisma/client";
import { Suspense } from "react";
import BannerSwiper from "@/components/BannerSwiper";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SearchInput from "@/components/SearchInput";
import { Search } from "lucide-react";
import Link from "next/link";

const prisma = new PrismaClient();

// 1. Component hiển thị danh sách Game
async function ContentSection({ query }: { query: string }) {
  const [banners, games] = await Promise.all([
    prisma.banner.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.game.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' },
      },
      include: {
        _count: {
          select: { accounts: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    })
  ]);

  return (
    /* Thêm hiệu ứng animate-in fade-in để lúc hiện data nhìn mượt, không bị khựng */
    <div className="animate-in fade-in duration-500">
      {!query && banners.length > 0 && <BannerSwiper banners={banners} />}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
            {query ? `Kết quả cho: "${query}"` : "Danh mục Game"}
          </h2>
          <div className="h-1 w-10 bg-[#f58220] mt-1"></div>
        </div>
        <SearchInput defaultValue={query} />
      </div>

      {games.length > 0 ? (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-6">
          {games.map((game) => (
            /* Link bọc toàn bộ item giúp vùng bấm cực rộng, ấn đâu cũng được */
            <Link
              href={`/game/${game.id}`}
              key={game.id}
              className="group flex flex-col items-center w-full"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all group-hover:shadow-md group-hover:-translate-y-1">
                <img
                  src={game.images[0] || "https://via.placeholder.com/400x400"}
                  alt={game.name}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-[10px] text-white px-2 py-0.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  {game._count.accounts} ACC
                </div>
              </div>
              
              {/* Tiêu đề nằm trong cùng thẻ Link nên ấn vào chữ cũng nhảy trang */}
              <div className="mt-3 text-center w-full">
                <h2 className="text-[11px] sm:text-[13px] font-semibold text-zinc-800 dark:text-zinc-200 truncate px-1 group-hover:text-[#f58220] transition-colors">
                  {game.name}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-zinc-100 dark:bg-zinc-900 p-6 rounded-full mb-4">
            <Search size={40} className="text-zinc-400" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Không tìm thấy game nào</h3>
          <p className="text-zinc-500 text-sm mt-1">Vui lòng thử lại với từ khóa khác.</p>
        </div>
      )}
    </div>
  );
}

// 2. Định nghĩa LoadingSkeleton
function LoadingSkeleton() {
  return (
    <div className="space-y-10">
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-6 pt-10">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="aspect-square w-full bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
            <div className="mt-3 w-3/4 h-3 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

// 3. Trang chủ chính
export default async function Home({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q = "" } = await searchParams;

  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans flex flex-col">
      <main className="max-w-[1200px] mx-auto w-full p-4 sm:p-8 flex-1">
        <Header />
        <Suspense key={q} fallback={<LoadingSkeleton />}>
          <ContentSection query={q} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

