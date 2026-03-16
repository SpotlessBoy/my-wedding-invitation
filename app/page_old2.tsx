'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, MessageCircle, Heart, Copy, Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import PetalRain from './components/PetalRain'; // 꽃입 컴포넌트
import NaverMap from './components/NaverMap'; // 네이버 지도 컴포넌트

// 부드럽게 나타나는 애니메이션 컴포넌트
const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-100px' }}
    transition={{ duration: 0.8, delay, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

export default function WeddingInvitation() {
  const [openAccount, setOpenAccount] = useState<'groom' | 'bride' | null>(null);

  return (
    <main className="min-h-screen bg-[#FDFDFD] text-[#333333] font-serif selection:bg-rose-100 relative">


      {/* 모바일 화면 중앙 정렬을 위한 컨테이너 */}
      <div className="max-w-[480px] mx-auto bg-white shadow-[0_0_20px_rgba(0,0,0,0.05)] relative z-10 min-h-screen">
        
        {/* 1. 메인 커버 섹션 - fixed로 고정, 스크롤해도 그대로 두고 아래 섹션이 위로 올라와 덮음 */}
        <section className="fixed top-0 left-1/2 -translate-x-1/2 z-0 w-full max-w-[480px] h-[100svh] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/main.jpg"
              alt="메인 웨딩 사진"
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-x-0 top-0 h-52 bg-gradient-to-b from-black/75 via-black/40 to-transparent pointer-events-none" />
          </div>
		  
		  {/* 👇 방금 지운 꽃잎 컴포넌트를 이 위치에 추가합니다! 👇 */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <PetalRain />
          </div>
          {/* 👆 꽃잎 추가 완료 👆 */}
		  
		  
          <FadeIn delay={0.5}>
            <div className="relative z-20 flex flex-col items-center justify-start min-h-[100svh] pt-14 px-8 text-center">
              <h1 className="text-2xl font-semibold tracking-[0.22em] mb-4 text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.8),0_2px_8px_rgba(0,0,0,0.6)]">
                우리, 결혼합니다
              </h1>
              <div className="w-[1px] h-10 bg-white/90 mx-auto mb-5 [box-shadow:0_0_6px_rgba(0,0,0,0.4)]" />
              <p className="text-lg font-medium text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.8),0_2px_6px_rgba(0,0,0,0.5)]">
                장상엽 <span className="text-sm font-normal text-white/95 mx-1">그리고</span> 박진솔
              </p>
              <p className="text-sm font-medium text-white/95 leading-relaxed mt-4 [text-shadow:0_1px_2px_rgba(0,0,0,0.7),0_2px_4px_rgba(0,0,0,0.5)]">
                2026년 6월 7일 일요일 12시 30분<br />
                호텔 인터불고 엑스코 2층 그랑파티오
              </p>
            </div>
          </FadeIn>
        </section>

        {/* 첫 화면 높이만큼 공간 확보 → 스크롤 시 이 아래 컨텐츠가 올라오며 메인 이미지를 덮음 */}
        <div className="relative z-0 h-[100svh] shrink-0" aria-hidden="true" />

        {/* 2~5. 스크롤되는 콘텐츠 - 모두 z-10으로 메인 이미지(fixed z-0) 위에 표시 */}
        <section className="relative z-10 -mt-px py-24 px-8 text-center bg-[#FAFAFA]">
          <FadeIn>
            <h2 className="text-lg tracking-[0.3em] text-rose-400 mb-10 font-medium">INVITATION</h2>
            <p className="leading-[2.2] text-[15px] mb-12">
              서로가 마주보며 다져온 사랑을<br />
              이제 함께 한 곳을 바라보며<br />
              걸어갈 수 있는 큰 사랑으로 키우고자 합니다.<br />
              <br />
              저희 두 사람이 사랑의 이름으로<br />
              지켜나갈 수 있도록<br />
              앞날을 축복해 주시면 감사하겠습니다.
            </p>
			
			{/* 👇 여기에 신랑 신부 서브 사진이 추가되었습니다 👇 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-[100%] aspect-[4/3] mx-auto mb-12 rounded-2xl overflow-hidden shadow-sm"
            >
              <Image
                src="/images/sub_main3.jpg" /* 👈 실제 사용할 이미지 파일명으로 변경하세요 */
                alt="신랑 신부 사진"
                fill
                className="object-cover object-center"
              />
            </motion.div>
            {/* 👆 추가된 영역 끝 👆 */}
			
            <div className="flex justify-center items-center gap-1 text-[15px] font-normal">
              <div className="text-right font-normal">
                <p>장규암 &middot; 라말분</p>
                <p className="mt-2">박주득 &middot; 서정남</p>
              </div>
              <div className="text-sm text-gray-400 text-left font-normal -ml-0.5">
                <p>
                  의 <span className="inline-block w-10 text-center text-black">아들</span>{' '}
                  <span className="text-base font-bold text-gray-900">장상엽</span>
                </p>
                <p className="mt-2">
                  의 <span className="inline-block w-10 text-center text-black">딸</span>{' '}
                  <span className="text-base font-bold text-gray-900">박진솔</span>
                </p>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* 3. 장소 안내 섹션 */}
        <section className="relative z-10 -mt-px py-24 px-8 text-center bg-white">
          <FadeIn>
            <h2 className="text-lg tracking-[0.3em] text-rose-400 mb-10 font-medium">LOCATION</h2>
			{/* 👇 여기에 웨딩홀 전경 사진이 추가되었습니다 👇 */}
            <div className="relative w-full aspect-[20/9] rounded-2xl overflow-hidden mb-10 shadow-sm mx-auto">
              <Image
                src="/images/wedding_hall.jpg" /* 👈 실제 저장한 웨딩홀 이미지 파일명으로 변경하세요 (예: hall.png) */
				priority
                alt="대구 인터불고 엑스코 그랑파티오 홀 전경"
                fill
                className="object-cover object-center"
                sizes="(max-w: 480px) 100vw, 480px"
              />
            </div>
            {/* 👆 추가된 영역 끝 👆 */}
            <p className="text-base font-medium mb-2">호텔 인터불고 엑스코, 2층 그랑파티오</p>
            <p className="text-[15px] mb-8">(대구광역시 북구 유통단지로80)</p>
            
            {/* 네이버 지도 연동 */}
            <div className="w-full h-[250px] mb-6 relative z-10">
              <NaverMap />
            </div>

          </FadeIn>
        </section>

        {/* 4. 마음 전하실 곳 (계좌번호) 섹션 */}
        <section className="relative z-10 -mt-px py-24 px-8 bg-[#FAFAFA]">
          <FadeIn>
            <h2 className="text-sm tracking-[0.3em] text-rose-400 mb-10 text-center font-medium">FOR YOUR HEART</h2>
            <p className="text-center text-sm text-gray-500 mb-8 leading-relaxed">
              참석이 어려우신 분들을 위해<br />
              계좌번호를 기재하였습니다.<br />
              너른 양해 부탁드립니다.
            </p>

            {/* 신랑측 계좌 */}
            <div className="mb-4">
              <button 
                onClick={() => setOpenAccount(openAccount === 'groom' ? null : 'groom')}
                className="w-full bg-white border border-gray-200 py-4 px-6 rounded-lg flex justify-between items-center text-[15px]"
              >
                <span>신랑측 계좌번호</span>
                <span className="text-gray-400">{openAccount === 'groom' ? '▲' : '▼'}</span>
              </button>
              {openAccount === 'groom' && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }} 
                  className="bg-gray-50 p-6 border-x border-b border-gray-200 rounded-b-lg text-sm"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-gray-500 mb-1">농협 123-4567-8901-23</p>
                      <p>예금주: 신랑이름</p>
                    </div>
                    <button className="flex items-center gap-1 text-xs bg-white border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-100">
                      <Copy size={12} /> 복사
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* 신부측 계좌 */}
            <div>
              <button 
                onClick={() => setOpenAccount(openAccount === 'bride' ? null : 'bride')}
                className="w-full bg-white border border-gray-200 py-4 px-6 rounded-lg flex justify-between items-center text-[15px]"
              >
                <span>신부측 계좌번호</span>
                <span className="text-gray-400">{openAccount === 'bride' ? '▲' : '▼'}</span>
              </button>
              {openAccount === 'bride' && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }} 
                  className="bg-gray-50 p-6 border-x border-b border-gray-200 rounded-b-lg text-sm"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-gray-500 mb-1">국민 123-456-78-90123</p>
                      <p>예금주: 신부이름</p>
                    </div>
                    <button className="flex items-center gap-1 text-xs bg-white border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-100">
                      <Copy size={12} /> 복사
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </FadeIn>
        </section>

        {/* 5. 푸터 (카카오톡 공유 등) */}
        <footer className="relative z-10 -mt-px py-12 bg-white text-center">
          <FadeIn>
            <div className="flex justify-center gap-4 mb-8">
              <button className="flex flex-col items-center gap-2 text-sm text-gray-600">
                <div className="w-12 h-12 bg-[#FEE500] rounded-full flex items-center justify-center text-black">
                  <MessageCircle size={20} />
                </div>
                카카오톡 공유
              </button>
              <button className="flex flex-col items-center gap-2 text-sm text-gray-600">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                  <Copy size={20} />
                </div>
                링크 복사
              </button>
            </div>
            <p className="text-xs text-gray-400 tracking-widest">
              &copy; 2026. Groom & Bride.
            </p>
          </FadeIn>
        </footer>

      </div>
    </main>
  );
}