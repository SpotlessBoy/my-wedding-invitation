import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    url: "청첩장 완성 후 호스팅할 실제 도메인 주소 (예: https://yeop-n-sol.vercel.app)", 
    siteName: "모바일 청첩장",
    images: [
      {
        url: "/images/thumbnail.jpg", // 👈 메인 커버로 쓰신 예쁜 사진 경로!
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
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
