import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col font-sans selection:bg-[#f58220] selection:text-white">
      <main className="max-w-[1200px] mx-auto w-full p-4 sm:p-8 flex-1 flex flex-col">
        {/* Header vẫn hiện để khách có thể điều hướng đi chỗ khác */}
        <Header />

        <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
          {/* Icon cảnh báo với hiệu ứng động */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-[#f58220] blur-3xl opacity-20 animate-pulse"></div>
            <div className="relative bg-zinc-100 dark:bg-zinc-900 p-8 rounded-full border border-zinc-200 dark:border-zinc-800">
              <AlertCircle size={80} className="text-[#f58220]" />
            </div>
          </div>

          {/* Thông báo lỗi */}
          <h1 className="text-6xl md:text-8xl font-black text-zinc-900 dark:text-white mb-4 tracking-tighter">
            404
          </h1>
          <h2 className="text-xl md:text-2xl font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide mb-6">
            Ối! Trang này không tồn tại
          </h2>
          <p className="text-zinc-500 max-w-md mb-10 leading-relaxed">
            Đường link bạn truy cập có vẻ đã bị sai hoặc tài khoản game này đã được bán mất rồi. Đừng lo, quay lại trang chủ để săn ACC khác nhé!
          </p>

          {/* Nút quay lại trang chủ */}
          <Link href="/">
            <button className="flex items-center gap-3 bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-black uppercase tracking-widest hover:bg-[#f58220] dark:hover:bg-[#f58220] hover:text-white transition-all active:scale-95 shadow-2xl">
              <Home size={20} strokeWidth={3} />
              Quay lại Trang Chủ
            </button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

