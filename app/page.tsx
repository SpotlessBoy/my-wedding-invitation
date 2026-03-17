'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, MessageCircle, Heart, Copy, Calendar as CalendarIcon, Map } from 'lucide-react';
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
  const [showMapImage, setShowMapImage] = useState(false); // 약도 이미지 팝업용

  return (
    <main className="min-h-screen bg-[#FDFDFD] text-[#333333] font-serif selection:bg-rose-100 relative">

      {/* 모바일 화면 중앙 정렬을 위한 컨테이너 */}
      <div className="max-w-[480px] mx-auto bg-white shadow-[0_0_20px_rgba(0,0,0,0.05)] relative z-10 min-h-screen">
        
        {/* 1. 메인 커버 섹션 */}
        <section className="fixed top-0 left-1/2 -translate-x-1/2 z-0 w-full max-w-[480px] h-[100svh] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/main.jpg"
              alt="메인 웨딩 사진"
              fill
              className="object-cover object-center"
              priority // 첫 화면이므로 무조건 최우선 로딩
              quality={85} // 원본 화질을 85%로 압축하여 WebP로 서빙 (시각적 차이 없이 용량 절반 감소)
              sizes="(max-w: 480px) 100vw, 480px"
            />
            <div className="absolute inset-x-0 top-0 h-52 bg-gradient-to-b from-black/75 via-black/40 to-transparent pointer-events-none" />
          </div>
          
          <div className="absolute inset-0 z-10 pointer-events-none">
            <PetalRain />
          </div>
          
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

        <div className="relative z-0 h-[100svh] shrink-0" aria-hidden="true" />

        {/* 2. 초대글 섹션 */}
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
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-[100%] aspect-[4/3] mx-auto mb-12 rounded-2xl overflow-hidden shadow-sm"
            >
              <Image
                src="/images/sub_main3.jpg"
                alt="신랑 신부 사진"
                fill
                quality={80} // 스크롤 시 나타나는 서브 사진 압축률 설정
                sizes="(max-w: 480px) 100vw, 480px" // 기기 해상도에 맞춘 정확한 이미지 크기 요청
                className="object-cover object-center"
              />
            </motion.div>
            
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
            <div className="relative w-full aspect-[20/9] rounded-2xl overflow-hidden mb-10 shadow-sm mx-auto">
              <Image
                src="/images/wedding_hall.jpg"
                priority // 지도를 보는 섹션은 정보성이 강하므로 미리 로딩
                quality={80}
                alt="대구 인터불고 엑스코 그랑파티오 홀 전경"
                fill
                className="object-cover object-center"
                sizes="(max-w: 480px) 100vw, 480px"
              />
            </div>
            <p className="text-base font-medium mb-2">호텔 인터불고 엑스코, 2층 그랑파티오</p>
            <p className="text-[15px] mb-8">(대구광역시 북구 유통단지로80)</p>
            
            <div className="w-full h-[250px] mb-6 relative z-10">
              <NaverMap />
            </div>

            <button
              onClick={() => setShowMapImage(true)}
              className="flex items-center justify-center gap-2 w-full py-3 mb-8 bg-rose-50 text-rose-500 rounded-xl font-medium text-[15px] border border-rose-100 transition-colors active:bg-rose-100"
            >
              <Map size={18} strokeWidth={2.5} />
              약도 이미지 보기
            </button>
          </FadeIn>
        </section>

        {/* 4. 마음 전하실 곳 섹션 생략 (기존 코드와 동일) */}
        <section className="relative z-10 -mt-px py-24 px-8 bg-[#FAFAFA]">
          {/* ... 기존 계좌번호 코드 동일 ... */}
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

        {/* 5. 푸터 */}
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

      {/* 약도 이미지 팝업 (모달) */}
      <AnimatePresence>
        {showMapImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMapImage(false)} 
            className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-6 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-[400px] aspect-[3/4] bg-white rounded-2xl overflow-hidden shadow-2xl"
            >
              <Image
                src="/images/way_to_hall.jpg" 
                alt="오시는 길 약도"
                fill
                quality={70} // 팝업으로 뜨는 텍스트 위주 약도는 70%로 강하게 압축하여 번쩍임(Flash) 현상 최소화
                priority // 모달이 켜질 때 지연 없이 즉각적으로 표시되도록 강제
                className="object-contain bg-white" 
                sizes="(max-w: 480px) 100vw, 480px"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}