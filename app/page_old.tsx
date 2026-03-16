'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, MessageCircle, Heart, Copy, Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import PetalRain from './components/PetalRain'; // 꽃입 컴포넌트

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
      <div className="max-w-[480px] mx-auto bg-white shadow-[0_0_20px_rgba(0,0,0,0.05)] overflow-hidden">
        
        {/* 1. 메인 커버 섹션 */}
        <section className="relative w-full h-[100svh] flex flex-col items-center justify-center p-8 text-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="w-full h-[60vh] bg-gray-100 rounded-t-full mb-8 relative overflow-hidden"
          >
            {/* 메인 웨딩 사진 👇 */}
            <Image
              src="/images/main.png"
              alt="메인 웨딩 사진"
              fill
              className="object-cover"
              priority
            />
          </motion.div>

          <FadeIn delay={0.5}>
            <h1 className="text-2xl tracking-[0.2em] mb-4 text-[#222]">우리, 결혼합니다</h1>
            <div className="w-[1px] h-12 bg-gray-300 mx-auto mb-6" />
            <p className="text-lg mb-4">장상엽 <span className="text-sm text-gray-400 font-light mx-1">그리고</span> 박진솔
</p>
            <p className="text-sm text-gray-500 leading-relaxed mt-4">
              2026년 6월 7일 일요일 12시 30분<br />
              호텔 인터불고 엑스코 2층 그랑파티오
            </p>
          </FadeIn>
        </section>

        {/* 2. 초대글 섹션 */}
        <section className="py-24 px-8 text-center bg-[#FAFAFA]">
          <FadeIn>
            <h2 className="text-sm tracking-[0.3em] text-rose-400 mb-10 font-medium">INVITATION</h2>
            <p className="leading-[2.2] text-[15px] mb-12">
              서로가 마주보며 다져온 사랑을<br />
              이제 함께 한 곳을 바라보며<br />
              걸어갈 수 있는 큰 사랑으로 키우고자 합니다.<br />
              <br />
              저희 두 사람이 사랑의 이름으로<br />
              지켜나갈 수 있도록<br />
              앞날을 축복해 주시면 감사하겠습니다.
            </p>
            <div className="flex justify-center items-center gap-4 text-[15px]">
              <div className="text-right">
                <p>아버지이름 &middot; 어머니이름</p>
                <p className="mt-2">아버님이름 &middot; 어머님이름</p>
              </div>
              <div className="text-sm text-gray-400 text-left">
                <p>의 <span className="text-black ml-1">장남</span> 신랑이름</p>
                <p className="mt-2">의 <span className="text-black ml-1">장녀</span> 신부이름</p>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* 3. 장소 안내 섹션 */}
        <section className="py-24 px-8 text-center">
          <FadeIn>
            <h2 className="text-sm tracking-[0.3em] text-rose-400 mb-10 font-medium">LOCATION</h2>
            <p className="text-lg font-medium mb-2">대구 인터불고 엑스코</p>
            <p className="text-[15px] mb-8">그랑파티오 홀</p>
            
            {/* 지도 플레이스홀더 */}
            <div className="w-full h-[250px] bg-gray-100 mb-6 flex items-center justify-center text-gray-400">
              [네이버/카카오 지도 API 위치]
            </div>

            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              대구 북구 엑스코로 10<br />
              (산격동 1674)
            </p>
          </FadeIn>
        </section>

        {/* 4. 마음 전하실 곳 (계좌번호) 섹션 */}
        <section className="py-24 px-8 bg-[#FAFAFA]">
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
        <footer className="py-12 bg-white text-center">
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