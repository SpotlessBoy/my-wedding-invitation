import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 1. 기존 설정: Unsplash 외부 이미지 허용
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    // 2. 추가된 설정: WebP 자동 압축률(Quality) 화이트리스트
    qualities: [25, 50, 70, 75, 80, 85, 90, 100],
  },
};

export default nextConfig;