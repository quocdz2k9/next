"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function BannerSwiper({ banners }: { banners: any[] }) {
  return (
    <div className="group relative w-full rounded-2xl overflow-hidden mb-8 shadow-lg">
      <Swiper
        spaceBetween={10}
        centeredSlides={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ 
          clickable: true,
          dynamicBullets: true 
        }}
        // Cấu hình navigation trỏ tới các class tùy chỉnh của chúng ta
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper aspect-[21/9] md:aspect-[3/1]"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <img
              src={banner.imageUrl}
              alt={banner.title || "Banner"}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Nút Prev Custom */}
      <button className="custom-prev absolute left-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:bg-black/50 disabled:hidden">
        <ChevronLeft size={24} strokeWidth={2.5} />
      </button>

      {/* Nút Next Custom */}
      <button className="custom-next absolute right-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hover:bg-black/50 disabled:hidden">
        <ChevronRight size={24} strokeWidth={2.5} />
      </button>

      {/* Tùy chỉnh Pagination (dùng style jsx để ghi đè CSS của thư viện) */}
      <style jsx global>{`
        .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.5) !important;
          opacity: 1 !important;
        }
        .swiper-pagination-bullet-active {
          background: white !important;
          width: 24px !important;
          border-radius: 4px !important;
          transition: width 0.3s ease;
        }
        /* Ẩn mũi tên mặc định của Swiper nếu nó vẫn hiện */
        .swiper-button-next, .swiper-button-prev {
          display: none !important;
        }
      `}</style>
    </div>
  );
}

