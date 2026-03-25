import type { Metadata } from "next";
import { Noto_Serif_KR } from "next/font/google"; 
import localFont from 'next/font/local';
import "./globals.css";


// 1. 본문용 기본 폰트
const notoSerif = Noto_Serif_KR({
  weight: ['300', '400', '500', '700'],
  subsets: ["latin"],
  variable: "--font-noto-serif", 
});

// 2. 포인트 폰트 (예: 제목용)
const customWeddingFont = localFont({
  src: '../public/fonts/wedd.woff2', // 👈 실제 폰트 파일명으로 꼭 수정해 주세요!
  variable: '--font-custom-wedding',
  weight: '400',
  display: 'swap'
});

const customWeddingFont2 = localFont({
  src: '../public/fonts/wedd2.woff2', // 👈 실제 폰트 파일명으로 꼭 수정해 주세요!
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
    // html 태그에 폰트 변수 두 개를 모두 주입합니다
    <html lang="ko" className={`${customWeddingFont.variable} ${customWeddingFont2.variable} antialiased`}>
      {/* 기본적으로 전체 글씨는 font-base(Noto Serif)가 적용되도록 설정합니다 */}
      <body className="font-base text-[#333333]">{children}</body>
    </html>
  );
}
