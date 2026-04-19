"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs, FreeMode } from "swiper/modules";
import { useState, useEffect } from "react";
import PhotoSwipeLightbox from 'photoswipe/lightbox';

// Import Styles
import 'photoswipe/style.css';
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/pagination";

export default function AccountImages({ images }: { images: string[] }) {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  // Khởi tạo PhotoSwipe Lightbox
  useEffect(() => {
    let lightbox: any = new PhotoSwipeLightbox({
      gallery: '#gallery-account', // ID của vùng chứa ảnh
      children: 'a', // Phần tử chứa link ảnh
      pswpModule: () => import('photoswipe'),
    });
    
    lightbox.init();

    return () => {
      lightbox.destroy();
      lightbox = null;
    };
  }, []);

  return (
    <div className="w-full" id="gallery-account">
      {/* Main Swiper - Hiển thị ảnh chính */}
      <Swiper
        style={{
          "--swiper-navigation-color": "#fff",
          "--swiper-pagination-color": "#f58220",
        } as any}
        spaceBetween={10}
        navigation={true}
        pagination={{ clickable: true, dynamicBullets: true }}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        modules={[FreeMode, Navigation, Thumbs, Pagination]}
        className="rounded-3xl overflow-hidden shadow-lg border border-zinc-200 dark:border-zinc-800 group"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            {/* Bọc ảnh trong thẻ <a> để PhotoSwipe nhận diện */}
            <a 
              href={img} 
              data-pswp-width="1600" 
              data-pswp-height="900" 
              target="_blank" 
              rel="noreferrer"
              className="block aspect-video bg-zinc-100 dark:bg-zinc-800 cursor-zoom-in"
            >
              <img 
                src={img} 
                className="w-full h-full object-contain transition-transform duration-300" 
                alt={`Account Detail ${index + 1}`} 
              />
              {/* Overlay icon phóng to khi hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
            </a>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnail Swiper - Danh sách ảnh nhỏ bên dưới */}
      <div className="mt-4 px-2">
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={12}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="mySwiper"
          breakpoints={{
            640: { slidesPerView: 5 },
            1024: { slidesPerView: 6 },
          }}
        >
          {images.map((img, index) => (
            <SwiperSlide key={index} className="cursor-pointer">
              <div className="aspect-video rounded-xl overflow-hidden border-2 border-transparent transition-all duration-300 [.swiper-slide-thumb-active_&]:border-[#f58220] [.swiper-slide-thumb-active_&]:scale-95 shadow-sm">
                <img src={img} className="w-full h-full object-cover" alt={`Thumb ${index + 1}`} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

