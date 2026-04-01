import type { Metadata } from "next";
import { Noto_Serif_KR } from "next/font/google"; 
import localFont from 'next/font/local';
import "./globals.css";

// ✨ 새로 추가: Vercel 애널리틱스 불러오기 ✨
import { Analytics } from '@vercel/analytics/react';

// 1. 본문용 기본 폰트
const notoSerif = Noto_Serif_KR({
  weight: ['300', '400', '500', '700'],
  subsets: ["latin"],
  variable: "--font-noto-serif", 
});

// 2. 포인트 폰트 (예: 제목용)
const customWeddingFont = localFont({
  src: '../public/fonts/wedd.woff2', 
  variable: '--font-custom-wedding',
  weight: '400',
  display: 'swap'
});

const customWeddingFont2 = localFont({
  src: '../public/fonts/wedd2.woff2', 
  variable: '--font-custom-wedding2',
  weight: '400',
  display: 'swap'
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "장상엽 ❤️ 박진솔 결혼합니다",
  description: "2026년 6월 7일 일요일 12시 30분, 호텔 인터불고 엑스코",
  openGraph: {
    title: "장상엽 ❤️ 박진솔 결혼합니다",
    description: "저희 두 사람의 빛나는 시작을 함께 축복해 주세요.",
    url: "https://yeop-n-sol.vercel.app", 
    siteName: "모바일 청첩장",
    images: [
      {
        url: "/images/thumbnail_v2.jpg", 
        width: 512,
        height: 772,
        alt: "이쁜~ 스냅",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${customWeddingFont.variable} ${customWeddingFont2.variable} antialiased`}>
      <body className="font-base text-[#333333]">
        {children}
        
        {/* ✨ 화면에는 안 보이지만 방문자를 몰래 카운트하는 비밀 요원입니다 ✨ */}
        <Analytics />
      </body>
    </html>
  );
}