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
    qualities: [25, 50, 60, 70, 75, 80, 85, 90, 100],
localPatterns: [
      // 1. 꼬리표가 아예 없는 기본 이미지들 허용 (네이버/카카오 아이콘 등)
      {
        pathname: "/**",
        search: "", 
      },
      // 2. 캐시 초기화용 꼬리표(?v=2)가 붙은 이미지들 허용
      {
        pathname: "/**",
        search: "?v=2",
      },
	  {
        pathname: "/**",
        search: "?v=3",
      },
	  {
        pathname: "/**",
        search: "?v=4",
      },
    ],
  },
};

export default nextConfig;