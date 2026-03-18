'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, MessageCircle, Heart, Copy, Calendar as CalendarIcon, Map, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import PetalRain from './components/PetalRain'; // 꽃입 컴포넌트
import NaverMap from './components/NaverMap'; // 네이버 지도 컴포넌트

// 부드럽게 나타나는 애니메이션 컴포넌트
const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} // 50은 화면 밖으로 튕겨 나가니, 부드러운 20px로 다듬어줍니다
    whileInView={{ opacity: 1, y: 0 }}
    // 👇 once: false로 반복을 살리고, amount를 0으로 낮춰 덜덜거림을 차단합니다 👇
    viewport={{ once: false, amount: 0 }} 
    transition={{ duration: 0.6, delay, ease: 'easeOut' }} // 거리가 짧아졌으니 속도도 0.6초로 텐션감 있게!
  >
    {children}
  </motion.div>
);

export default function WeddingInvitation() {
  const [openAccount, setOpenAccount] = useState<'groom' | 'bride' | null>(null);
  const [showMapImage, setShowMapImage] = useState(false); // 약도 이미지 팝업용
  
  
  // 👇 새로 추가할 갤러리용 상태 및 데이터 👇
  const [showAllGallery, setShowAllGallery] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  // 갤러리 이미지 데이터 (총 20장 예시)
  // aspect 속성을 다르게 주어 가로/세로가 자연스럽게 섞이는 메이슨리 레이아웃을 만듭니다.
  const galleryPhotos = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    src: `/images/gallery/${i + 1}.jpg?v=3`, // public/images/gallery/ 폴더에 1.jpg~20.jpg 저장 필요
    aspect: i % 4 === 0 ? 'aspect-[4/3]' : i % 7 === 0 ? 'aspect-square' : 'aspect-[3/4]', 
  }));

  const displayedPhotos = showAllGallery ? galleryPhotos : galleryPhotos.slice(0, 6); // 처음엔 6장만 노출

  // 스와이프 및 버튼 넘김 처리 함수
  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPhotoIndex((prev) => (prev === galleryPhotos.length - 1 ? 0 : prev! + 1));
  };
  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPhotoIndex((prev) => (prev === 0 ? galleryPhotos.length - 1 : prev! - 1));
  };
  // 👆 갤러리용 상태 끝 👆
  
  
  
  // D-Day 타이머 상태 관리
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    
    // ✅ 모바일 스크롤 시 주소창 숨김/보임에 따른 화면 튐 현상 방지 로직
    let windowWidth = window.innerWidth;

    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    const handleResize = () => {
      // 화면 너비가 변경되었을 때만(예: 기기 가로/세로 회전) vh를 재계산
      if (window.innerWidth !== windowWidth) {
        windowWidth = window.innerWidth;
        setVh();
      }
    };

    setVh(); // 최초 1회 실행
    window.addEventListener('resize', handleResize); // 수정된 리사이즈 핸들러 등록
    
    // ----------------------------------------------------------------------
    
    // 목표 날짜: 2026년 6월 7일 12시 30분
    const target = new Date('2026-06-07T12:30:00+09:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          mins: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          secs: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        clearInterval(interval);
      }
    }, 1000);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize); // 클린업 함수에도 handleResize 적용
    };
  }, []);
  
  // 갤러리 모달 오픈 시 배경 스크롤 및 브라우저 UI 바운스 완벽 차단
  useEffect(() => {
    if (selectedPhotoIndex !== null || showMapImage) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none'; // 브라우저 기본 터치 액션 무시
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = 'auto';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = 'auto';
    };
  }, [selectedPhotoIndex, showMapImage]);


  // 2026년 6월 달력 데이터 (6월 1일은 월요일)
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  const calendarDays = [
    null, 1, 2, 3, 4, 5, 6,
    7, 8, 9, 10, 11, 12, 13,
    14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27,
    28, 29, 30
  ];

  return (
    // 변경 후 (우클릭 방지 이벤트 및 Tailwind CSS 선택 방지 클래스 추가)
	<main 
		className="min-h-screen bg-[#FDFDFD] text-[#333333] font-serif selection:bg-rose-100 relative select-none [&_img]:pointer-events-none"
		onContextMenu={(e) => e.preventDefault()} // 우클릭 방지
	>

      {/* 모바일 화면 중앙 정렬을 위한 컨테이너 */}
      <div className="max-w-[480px] mx-auto bg-white shadow-[0_0_20px_rgba(0,0,0,0.05)] relative z-10 min-h-screen">
        
        {/* 1. 메인 커버 섹션 */}
        {/* 수정 전: h-[100svh] 제거하고 style 추가 */}
        <section
		className="fixed top-0 left-1/2 -translate-x-1/2 z-0 w-full max-w-[480px] overflow-hidden"
		style={{
				height: 'calc(var(--vh, 1vh) * 100)',
				willChange: 'transform',           // ✅ 추가
				backfaceVisibility: 'hidden',      // ✅ 추가
				WebkitBackfaceVisibility: 'hidden' // ✅ 추가 (Safari/카카오 대응)
				}}
		>
          <div className="absolute inset-0">
            <Image
              src="/images/main.jpg?v=2"
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
            {/* 수정 전: min-h-[100svh] 제거하고 style 추가 */}
            <div
				className="relative z-20 flex flex-col items-center justify-start pt-14 px-8 text-center"
				style={{
					minHeight: 'calc(var(--vh, 1vh) * 100)',
					willChange: 'transform',           // ✅ 추가
					backfaceVisibility: 'hidden',      // ✅ 추가
					WebkitBackfaceVisibility: 'hidden' // ✅ 추가
						}}
			>
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

        {/* 메인 커버 뒤에서 공간을 차지해주는 더미 div */}
        {/* 수정 전: h-[100svh] 제거하고 style 추가 */}
        <div 
          className="relative z-0 shrink-0" 
          style={{ height: 'calc(var(--vh, 1vh) * 100)' }} 
          aria-hidden="true" 
        />

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
              initial={{ opacity: 0, y: 15 }} // y축 이동을 추가해 주면 서서히 올라옵니다
			  whileInView={{ opacity: 1, y: 0 }}
			  viewport={{ once: false, amount: 0.1 }} // once: true를 once: false로 변경
			  transition={{ duration: 0.8 }}
              className="relative w-[100%] aspect-[4/3] mx-auto mb-12 rounded-2xl overflow-hidden shadow-sm"
            >
              <Image
                src="/images/sub_main3.jpg?v=2"
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


{/* 🌟 새로 추가된 3. WEDDING DATE 섹션 🌟 */}
        <section className="relative z-10 -mt-px py-24 px-8 text-center bg-white">
          <FadeIn>
            <h2 className="text-lg tracking-[0.3em] text-rose-400 mb-10 font-medium">WEDDING DATE</h2>
            
            {/* 1. 날짜 및 시간 강조 */}
            <div className="mb-12">
              <p className="text-[28px] font-serif tracking-[0.15em] text-gray-800 mb-2">2026. 06. 07.</p>
              <p className="text-[15px] text-gray-500 font-medium">일요일  12시 30분</p>
            </div>

            {/* 2. 달력 디자인 */}
            <div className="w-full max-w-[280px] mx-auto mb-14">
              <div className="grid grid-cols-7 gap-y-4 text-xs tracking-widest mb-4 border-b border-t border-gray-100 py-4">
                {weekDays.map((day, i) => (
                  <div key={i} className={`font-medium ${
                    i === 0 ? 'text-rose-400' : // 일요일은 빨간색(로즈톤)
                    i === 6 ? 'text-blue-400' : // 토요일은 파란색
                    'text-gray-400'             // 평일은 회색
                  }`}>
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-y-5 text-[15px] font-serif">
                {calendarDays.map((day, i) => {
                  // 요일 인덱스 확인 (0: 일요일, 6: 토요일)
                  const isSunday = i % 7 === 0;
                  const isSaturday = i % 7 === 6;
                  // 6월 3일 (지방선거 공휴일) 지정
                  const isHoliday = day === 3;
                  
                  return (
                    <div key={i} className="flex items-center justify-center">
                      {day === 7 ? (
                        // 결혼식 당일 (하이라이트)
                        <div className="w-8 h-8 flex items-center justify-center bg-rose-100 text-rose-500 rounded-full font-bold shadow-sm">
                          {day}
                        </div>
                      ) : (
                        // 그 외의 날짜 (토/일/공휴일 색상 적용)
                        <span className={`
                          ${isSunday || isHoliday ? 'text-rose-400' : ''} 
                          ${isSaturday ? 'text-blue-400' : ''} 
                          ${!isSunday && !isSaturday && !isHoliday ? 'text-gray-700' : ''}
                        `}>
                          {day}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
			
			{/* 👇 새로 추가되는 분위기 환기용 가로 스냅 사진 👇 */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }} // y축 이동을 추가해 주면 서서히 올라옵니다
			  whileInView={{ opacity: 1, y: 0 }}
			  viewport={{ once: false, amount: 0.1 }} // once: true를 once: false로 변경
			  transition={{ duration: 0.8 }}
              className="relative w-[100%] aspect-[3/2] mx-auto mb-10 rounded-xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.03)]"
            >
              <Image
                src="/images/sub_date.jpg?v=2" /* 👈 준비하신 가로형 스냅 사진 파일명으로 변경하세요 */
                alt="골목길 스냅이에욥"
                fill
                quality={80} // 스크롤 시 로딩되므로 적절한 압축률 적용
                className="object-cover object-center"
                sizes="(max-w: 480px) 100vw, 480px"
              />
            </motion.div>
            {/* 👆 추가된 스냅 사진 끝 👆 */}

            {/* 3 & 4. 실시간 카운트다운 및 동적 메시지 */}
            {isMounted && (
              <div className="bg-[#FAFAFA] rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-center items-center gap-3 mb-6">
                  {[
                    { label: 'DAYS', value: timeLeft.days },
                    { label: 'HOURS', value: timeLeft.hours },
                    { label: 'MINS', value: timeLeft.mins },
                    { label: 'SECS', value: timeLeft.secs },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl font-medium text-gray-800 mb-2 border border-gray-50">
                        {String(item.value).padStart(2, '0')}
                      </div>
                      <span className="text-[10px] text-gray-400 tracking-widest font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[15px] text-gray-600 font-medium mt-2">
                  상엽 <span className="text-rose-400 text-xs mx-0.5">♥</span> 진솔의 결혼식이{' '}
                  <span className="text-rose-500 font-bold font-sans tracking-tight lining-nums tabular-nums">{timeLeft.days}일</span> 남았습니다.
                </p>
              </div>
            )}
          </FadeIn>
        </section>
		
        {/* 4. 장소 안내 섹션 (배경색 교차를 위해 #FAFAFA로 변경) */}
        <section className="relative z-10 -mt-px py-24 px-8 text-center bg-[#FAFAFA]">
          <FadeIn>
            <h2 className="text-lg tracking-[0.3em] text-rose-400 mb-10 font-medium">LOCATION</h2>
            <div className="relative w-full aspect-[20/9] rounded-2xl overflow-hidden mb-10 shadow-sm mx-auto">
              <Image
                src="/images/wedding_hall.jpg?v=2"
                priority // 지도를 보는 섹션은 정보성이 강하므로 미리 로딩
                quality={80}
                alt="대구 인터불고 엑스코 그랑파티오 홀 전경"
                fill
                className="object-cover object-center"
                sizes="(max-w: 480px) 100vw, 480px"
              />
            </div>
            <p className="text-base font-medium mb-2">호텔 인터불고 엑스코, 2층 그랑파티오</p>
            <p className="text-[15px] mb-8">(대구광역시 북구 유통단지로 80)</p>
            
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
			
			{/* 👇 새로 추가되는 네비게이션 연동 섹션 👇 */}
            <div className="mt-8 pt-8 border-t border-gray-100 text-left">
              <h3 className="font-bold text-gray-800 mb-1 text-base">네비게이션</h3>
              <p className="text-sm text-gray-500 mb-5">원하는 앱을 선택하시면 길안내가 시작합니다.</p>
              
              <div className="flex justify-between gap-2">
                {/* 1. 네이버 지도 (앱 호출 공식 URL) */}
                <button 
                  onClick={() => window.open('https://app.map.naver.com/launchApp/?version=11&menu=navigation&goalname=호텔 인터불고 엑스코&goalx=128.611285546387&goaly=35.9069985378003')}
                  className="flex-1 bg-white py-2.5 rounded-lg flex items-center justify-center gap-1.5 font-medium text-[13px] border border-gray-200 shadow-sm transition-colors active:bg-gray-50 text-gray-700"
                >
                  <Image src="/images/icon-naver.png" alt="네이버 지도" width={18} height={18} className="rounded-[4px]" />
                  네이버지도
                </button>

                {/* 2. 티맵 (URI 스킴 호출) */}
                <button 
                  onClick={() => window.location.href = 'tmap://route?goalname=호텔 인터불고 엑스코&goalx=128.611285546387&goaly=35.9069985378003'}
                  className="flex-1 bg-white py-2.5 rounded-lg flex items-center justify-center gap-1.5 font-medium text-[13px] border border-gray-200 shadow-sm transition-colors active:bg-gray-50 text-gray-700"
                >
                  <Image src="/images/icon-tmap.png" alt="티맵" width={18} height={18} className="rounded-[4px]" />
                  티맵
                </button>

                {/* 3. 카카오내비 (웹/앱 자동연결 링크) */}
                <button 
                  onClick={() => window.open('https://map.kakao.com/link/to/호텔 인터불고 엑스코,35.9069985378003,128.611285546387')}
                  className="flex-1 bg-white py-2.5 rounded-lg flex items-center justify-center gap-1.5 font-medium text-[13px] border border-gray-200 shadow-sm transition-colors active:bg-gray-50 text-gray-700"
                >
                  <Image src="/images/icon-kakao.png" alt="카카오내비" width={18} height={18} className="rounded-[4px]" />
                  카카오내비
                </button>
              </div>
            </div>
            {/* 👆 네비게이션 연동 섹션 끝 👆 */}
			
			
			
          </FadeIn>
        </section>
		
		
		{/* 🌟 새로 추가된 5. 갤러리 (GALLERY) 섹션 🌟 */}
        <section className="relative z-10 -mt-px py-24 px-6 bg-white text-center">
          <FadeIn>
            <h2 className="text-lg tracking-[0.3em] text-rose-400 mb-10 font-medium">GALLERY</h2>
            
            {/* 메이슨리(Masonry) 레이아웃 그리드 */}
            {/* CSS columns-2를 사용하여 세로로 흐르듯 자연스럽게 빈 공간을 채웁니다 */}
            <div className="columns-2 gap-3 space-y-3 mb-8">
              {displayedPhotos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  // 👇 끝에 break-inside-avoid 와 mb-3 을 추가했습니다 👇
                  className={`relative w-full ${photo.aspect} bg-gray-100 rounded-xl overflow-hidden shadow-sm cursor-pointer transform transition-transform active:scale-95 break-inside-avoid mb-3`}
                  onClick={() => setSelectedPhotoIndex(photo.id)}
                >
                  <Image
                    src={photo.src}
                    alt={`웨딩 갤러리 사진 ${photo.id + 1}`}
                    fill
                    quality={50} // 썸네일은 용량을 위해 강하게 압축
					// 👇 이 마법의 한 줄을 추가합니다 (인덱스가 6 미만, 즉 첫 6장만 미리 로딩) 👇
                    priority={index < 6}
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-w: 480px) 50vw, 240px"
                  />
                </motion.div>
              ))}
            </div>

            {/* 더보기 및 접기 버튼 (토글) */}
            <button
              onClick={() => setShowAllGallery(!showAllGallery)}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gray-50 text-gray-600 rounded-full font-medium text-[15px] border border-gray-200 transition-colors active:bg-gray-100 mt-4"
            >
              {showAllGallery ? '접기' : '더 보기'}
            </button>
            
          </FadeIn>
        </section>
		
		

        {/* 6. 마음 전하실 곳 섹션 생략 (기존 코드와 동일) */}
        <section className="relative z-10 -mt-px py-24 px-8 bg-white">
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

        {/* 6. 푸터 */}
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
              &copy; 2026. Yeop & Sol. H-E-A
            </p>
          </FadeIn>
        </footer>

      </div>


	  {/* 👇 갤러리 라이트박스 (확대 모달) 👇 */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhotoIndex(null)} // 여백 클릭 시 닫힘
            className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center touch-none"
          >
            {/* 닫기 버튼 */}
            <button 
              onClick={() => setSelectedPhotoIndex(null)}
              className="absolute top-6 right-6 text-white/80 p-2 z-[210] active:scale-90"
            >
              <X size={28} strokeWidth={2} />
            </button>

            {/* 메인 이미지 (스와이프 기능 포함) */}
            <motion.div 
              key={selectedPhotoIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-[480px] h-[75dvh] touch-pan-x"
              drag="x" // 좌우 스와이프 활성화
              dragConstraints={{ left: 0, right: 0 }} // 드래그 탄성 제한
			  dragDirectionLock // 수직/수평 드래그 방향을 엄격하게 고정
              onDragEnd={(e, { offset }) => {
                // 스와이프 감도 (50px 이상 밀면 넘어감)
                if (offset.x < -50) handleNextPhoto(e as any);
                else if (offset.x > 50) handlePrevPhoto(e as any);
              }}
              onClick={(e) => e.stopPropagation()} // 사진 자체를 클릭했을 땐 안 닫히게 방어
            >
              <Image
                src={galleryPhotos[selectedPhotoIndex].src}
                alt={`확대된 웨딩 사진 ${selectedPhotoIndex + 1}`}
                fill
                quality={90} // 확대 사진은 고화질로 렌더링
                priority
                className="object-contain" // 비율이 깨지지 않게 전체가 다 보이도록 설정
                sizes="100vw"
              />
            </motion.div>

            {/* 좌우 네비게이션 버튼 및 카운터 */}
            <div className="absolute bottom-10 inset-x-0 flex items-center justify-between px-8 z-[210]">
              <button 
                onClick={handlePrevPhoto}
                className="p-3 bg-white/10 rounded-full text-white backdrop-blur-md active:bg-white/20"
              >
                <ChevronLeft size={24} />
              </button>
              
              <span className="text-white/70 text-sm font-medium tracking-widest">
                {selectedPhotoIndex + 1} / {galleryPhotos.length}
              </span>

              <button 
                onClick={handleNextPhoto}
                className="p-3 bg-white/10 rounded-full text-white backdrop-blur-md active:bg-white/20"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* 👆 갤러리 라이트박스 끝 👆 */}



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
                src="/images/way_to_hall.jpg?v=2" 
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