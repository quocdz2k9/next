import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AccountImages from "@/components/AccountImages";
import { ChevronRight, ShieldCheck, Zap, MessageCircle } from "lucide-react";
import Link from "next/link";

const prisma = new PrismaClient();

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AccountDetailPage({ params }: Props) {
  const { id } = await params;
  const accId = parseInt(id);

  if (isNaN(accId)) notFound();

  const account = await prisma.account.findUnique({
    where: { id: accId },
    include: { game: true }
  });

  if (!account) notFound();

  const ZALO_PHONE = "0982779105";
  // Tối ưu tin nhắn Zalo kèm Link hiện tại để admin dễ kiểm tra
  const zaloUrl = `https://zalo.me/${ZALO_PHONE}?text=${encodeURIComponent(
    `Chào shop, mình muốn mua tài khoản:\n- MS: #${account.id}\n- Tên: ${account.name}\n- Giá: ${account.priceText}`
  )}`;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col font-sans">
      <main className="max-w-[1200px] mx-auto w-full p-4 sm:p-8 flex-1">
        <Header />

        <div className="flex items-center gap-2 text-[11px] sm:text-xs text-zinc-500 mb-6">
          <Link href="/" className="hover:text-[#f58220]">Trang chủ</Link>
          <ChevronRight size={12} />
          <Link href={`/game/${account.gameId}`} className="hover:text-[#f58220]">{account.game.name}</Link>
          <ChevronRight size={12} />
          <span className="text-zinc-900 dark:text-zinc-300 font-medium">Mã số #{account.id}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-4">
            <AccountImages images={account.images} />
            <p className="text-[11px] text-zinc-400 text-center italic">
              (Ấn vào ảnh để phóng to xem chi tiết)
            </p>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <span className="bg-[#f58220]/10 text-[#f58220] text-xs font-bold px-3 py-1 rounded-full uppercase">
                Mã số: #{account.id}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mt-4 mb-2">
                {account.name}
              </h1>
              
              <div className="mb-6">
                <span className="text-3xl font-black text-[#f58220]">{account.priceText}</span>
                {/* Đã bỏ phần giá gốc gạch ngang ở đây */}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="flex items-center gap-2 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl">
                  <ShieldCheck className="text-green-500" size={20} />
                  <span className="text-xs font-medium dark:text-zinc-300">Uy tín 100%</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl">
                  <Zap className="text-yellow-500" size={20} />
                  <span className="text-xs font-medium dark:text-zinc-300">Giao acc ngay</span>
                </div>
              </div>

              <a
                href={zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-[#0068ff] hover:bg-[#0056d2] text-white py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 shadow-lg shadow-blue-500/20"
              >
                <MessageCircle size={24} />
                MUA NGAY QUA ZALO
              </a>
              <p className="text-center text-[11px] text-zinc-400 mt-4 italic">
                * Nhấn nút trên để chat trực tiếp với Admin qua Zalo để giao dịch
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800">
              <h2 className="font-bold text-zinc-900 dark:text-white mb-4 border-l-4 border-[#f58220] pl-3">
                Thông tin chi tiết
              </h2>
              <div className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed whitespace-pre-line">
                {account.description}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

