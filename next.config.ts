import million from 'million/compiler';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Giữ nguyên các option cũ của bạn ở đây */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

// Cấu hình Million.js để tự động tối ưu hóa các thành phần giao diện
const millionConfig = {
  auto: true, // Tự động phát hiện component cần tối ưu
};

export default million.next(nextConfig, millionConfig);

