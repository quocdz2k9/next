import { PrismaClient } from "@prisma/client";
import { Suspense } from "react";
import BannerSwiper from "@/components/BannerSwiper";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SearchInput from "@/components/SearchInput";
import { Search } from "lucide-react";
import Link from "next/link";

const prisma = new PrismaClient();

async function ContentSection({ query }: { query: string }) {
  const [banners, games] = await Promise.all([
    prisma.banner.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.game.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' },
      },
      include: {
        _count: { select: { accounts: true } }
      },
      orderBy: { createdAt: 'desc' },
    })
  ]);

  return (
    <div className="animate-in fade-in duration-700">
      {!query && banners.length > 0 && (
        <div className="mb-10 rounded-3xl overflow-hidden shadow-2xl">
           <BannerSwiper banners={banners} />
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter italic">
            {query ? `Kết quả: "${query}"` : "Danh mục Game"}
          </h2>
          <div className="h-1.5 w-12 bg-[#f58220] mt-1 rounded-full"></div>
        </div>
        <SearchInput defaultValue={query} />
      </div>

      {games.length > 0 ? (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-8">
          {games.map((game) => (
            <Link
              href={`/game/${game.id}`}
              key={game.id}
              className="group relative flex flex-col w-full"
            >
              {/* Vùng ảnh: Bo góc mạnh, tràn viền */}
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2rem] border border-zinc-200 dark:border-white/5 bg-zinc-100 dark:bg-zinc-900 shadow-sm transition-all duration-500 group-hover:shadow-[0_20px_40px_-15px_rgba(245,130,32,0.3)] group-hover:-translate-y-2">
                <img
                  src={game.images[0] || "https://via.placeholder.com/400x400"}
                  alt={game.name}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay gradient cho đẹp */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#f58220] text-[9px] font-black text-white px-3 py-1 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 whitespace-nowrap uppercase">
                  {game._count.accounts} Tài khoản
                </div>
              </div>

              {/* Tiêu đề: To, dễ nhìn và đổi màu theo group */}
              <div className="mt-4 text-center">
                <h2 className="text-xs sm:text-sm font-black text-zinc-800 dark:text-zinc-200 truncate px-2 transition-colors duration-300 group-hover:text-[#f58220] uppercase tracking-wide">
                  {game.name}
                </h2>
                <p className="text-[10px] text-zinc-500 font-bold mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity">XEM NGAY</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="bg-zinc-100 dark:bg-zinc-900 p-8 rounded-full mb-6 animate-bounce">
            <Search size={48} className="text-zinc-400" />
          </div>
          <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase">Hết sạch game rồi!</h3>
          <p className="text-zinc-500 text-sm mt-2">Thử tìm tên khác xem sao bạn ơi...</p>
        </div>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-8 pt-10">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="flex flex-col items-center space-y-4">
          <div className="aspect-[3/4] w-full bg-zinc-200 dark:bg-zinc-800 rounded-[2rem] animate-pulse" />
          <div className="w-20 h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export default async function Home({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q = "" } = await searchParams;

  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans flex flex-col selection:bg-[#f58220] selection:text-white">
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

