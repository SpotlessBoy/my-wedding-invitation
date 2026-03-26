'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, MessageCircle, Heart, Copy, Calendar as CalendarIcon, Map, X, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Utensils, Flower2 } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import PetalRain from './components/PetalRain'; // 꽃입 컴포넌트
import NaverMap from './components/NaverMap'; // 네이버 지도 컴포넌트
import Script from 'next/script';



const brightWeddingColors = ['#FFD1DC', '#FFFFE0', '#FFDAB9', '#FFFFF0', '#FFB6C1', '#FFF8DC'];
// 하트가 아닌 진짜 '꽃잎(Teardrop)' 모양 SVG
const RealPetalSVG = ({ color }: { color: string }) => (
  <svg viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,0.15))' }}>
    <path d="M12 2C7 2 3 7 3 12C3 18 12 22 12 22C12 22 21 18 21 12C21 7 17 2 12 2Z" />
  </svg>
);

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


// 👇 1. 커튼 전용 애니메이션 정의 (TS 에러 해결) 👇
const curtainLeftVariants = {
  initial: { x: 0 },
  animate: { x: 0 },
  exit: { 
    x: '-100%', 
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as [number, number, number, number], delay: 0.3 } 
  },
};

const curtainRightVariants = {
  initial: { x: 0 },
  animate: { x: 0 },
  exit: { 
    x: '100%', 
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as [number, number, number, number], delay: 0.3 } 
  },
};


export default function WeddingInvitation() {
  const [openAccount, setOpenAccount] = useState<'groom' | 'bride' | null>(null);
  const [showMapImage, setShowMapImage] = useState(false); // 약도 이미지 팝업용
  
  // 👇 1. 인트로 스플래시 상태 추가 (처음엔 무조건 true로 켜둠) 👇
  const [showIntro, setShowIntro] = useState(true);
  

// 👇 1. 하트 꽃잎 상태를 만듭니다 (처음엔 빈 배열로 두어 서버를 안심시킵니다) 👇
  const [heartPetals, setHeartPetals] = useState<any[]>([]);

  // 👇 2. 브라우저가 화면을 켠 직후(Client-side)에 랜덤 값을 계산합니다 👇
  useEffect(() => {
    const petals = [];
    const count = 60; // 테두리를 감쌀 꽃잎 개수
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 2;
      // 하트 모양을 그리는 수학 공식 (x, y 좌표)
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      
      petals.push({
        id: i,
        x: x * 10, // 가로 크기 확장
        y: y * 10 - 15, // 세로 크기 확장 및 글자 중앙에 맞춤
        rotation: Math.random() * 360,
        scale: 0.6 + Math.random() * 0.6,
        color: brightWeddingColors[Math.floor(Math.random() * brightWeddingColors.length)],
        // 나중에 바람에 날아갈(흩어질) 도착지 좌표
        scatterX: (Math.random() - 0.5) * 800, 
        scatterY: (Math.random() - 0.5) * 800,
        scatterRot: (Math.random() - 0.5) * 720,
        delay: Math.random() * 0.5, // 뿅! 하고 나타나는 시간차
      });
    }
    setHeartPetals(petals); // 계산이 끝나면 상태에 집어넣어 화면에 그립니다!
  }, []);
  // 👆 하트 좌표 계산 끝 👆
   
  
  // 👇 2. 하트 흩날리는 걸 감상할 수 있게 타이머를 2.8초(2800)로 세팅해주세요 👇
  useEffect(() => {
    if (showIntro) {
      document.body.style.overflow = 'hidden'; 
      const timer = setTimeout(() => setShowIntro(false), 2800);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = 'unset'; 
    }
  }, [showIntro]);
  
  
  // 👇 🚨 아이폰 사파리 확대 완벽 원천 차단 🚨 👇
  useEffect(() => {
    // 1. 두 손가락 핀치 줌(Pinch Zoom) 차단 (touchmove 뿐만 아니라 touchstart도 차단)
    const preventPinchZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // 2. 따닥! 더블 탭 줌(Double Tap Zoom) 차단
    let lastTouchEnd = 0;
    const preventDoubleTapZoom = (e: TouchEvent) => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };

    // 3. 사파리 전용 뒷문(Gesture) 완벽 차단
    const preventGesture = (e: Event) => {
      e.preventDefault();
    };

    // 표준 터치 이벤트 방어
    document.addEventListener('touchstart', preventPinchZoom, { passive: false });
    document.addEventListener('touchmove', preventPinchZoom, { passive: false });
    document.addEventListener('touchend', preventDoubleTapZoom, { passive: false });

    // 사파리 독자적 제스처 이벤트 방어 (TS 에러 방지를 위해 as any 처리)
    document.addEventListener('gesturestart', preventGesture as any, { passive: false });
    document.addEventListener('gesturechange', preventGesture as any, { passive: false });
    document.addEventListener('gestureend', preventGesture as any, { passive: false });

    return () => {
      document.removeEventListener('touchstart', preventPinchZoom);
      document.removeEventListener('touchmove', preventPinchZoom);
      document.removeEventListener('touchend', preventDoubleTapZoom);
      
      document.removeEventListener('gesturestart', preventGesture as any);
      document.removeEventListener('gesturechange', preventGesture as any);
      document.removeEventListener('gestureend', preventGesture as any);
    };
  }, []);
  
  
  
  // 👇 새로 추가할 갤러리용 상태 및 데이터 👇
  const [showAllGallery, setShowAllGallery] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  // 👇 1. 프리로딩 타이머 상태 추가 👇
  const [preloadGallery, setPreloadGallery] = useState(false);

  useEffect(() => {
    // 하객이 첫 화면을 보고 3초쯤 지났을 때, 백그라운드에서 다음 갤러리 사진 다운로드를 시작합니다.
    const timer = setTimeout(() => {
      setPreloadGallery(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);
  

  // ✅ 1. 가로형(풍경 비율) 사진 번호를 여기에 적어주세요! (1번부터 28번 중)
  // 예시: 8번, 10번, 18번 사진이 가로형일 경우
  const landscapePhotoIds = [8, 9, 18]; 

  // 갤러리 이미지 데이터
  const galleryPhotos = Array.from({ length: 28 }).map((_, i) => {
    const photoNumber = i + 1;
    // 배열에 있는 번호면 가로형(4/3), 아니면 세로형(3/4) 비율 자동 적용
    const isLandscape = landscapePhotoIds.includes(photoNumber);
    
    return {
      id: i,
      src: `/images/gallery_v3/${photoNumber}.jpg`,
      aspect: isLandscape ? 'aspect-[4/3]' : 'aspect-[3/4]', 
    };
  });

  const displayedPhotos = showAllGallery ? galleryPhotos : galleryPhotos.slice(0, 6); // 처음엔 6장 노출 (짝수가 예쁨)

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
  
  // 👇 라이트박스 프리로딩을 위한 다음/이전 사진 인덱스 계산 👇
  const lightboxNextIndex = selectedPhotoIndex !== null 
    ? (selectedPhotoIndex === galleryPhotos.length - 1 ? 0 : selectedPhotoIndex + 1) 
    : 0;
  const lightboxPrevIndex = selectedPhotoIndex !== null 
    ? (selectedPhotoIndex === 0 ? galleryPhotos.length - 1 : selectedPhotoIndex - 1) 
    : 0;
  
  
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

      // 절대값을 사용하여 지나간 시간도 계산할 수 있게 합니다.
      const absDiff = Math.abs(difference);

      setTimeLeft({
        days: Math.floor(absDiff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((absDiff % (1000 * 60)) / 1000),
      });

      // 결혼식이 지났다고 해서 타이머를 멈추지 않고 계속 실행하거나, 
      // 필요에 따라 로직을 유지합니다. (D+ 계산을 위해 계속 실행 추천)
    }, 1000);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize); // 클린업 함수에도 handleResize 적용
    };
  }, []);
  
  // 갤러리 모달 오픈 시 배경 스크롤 및 브라우저 UI 바운스 완벽 차단
  useEffect(() => {
    // 👇 1. 브라우저의 네이티브 스크롤(주소창 끌어내림)을 강제로 막는 방어 함수 👇
    const preventDefault = (e: TouchEvent) => {
      e.preventDefault();
    };

    if (selectedPhotoIndex !== null || showMapImage || showIntro) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none'; // 브라우저 기본 터치 액션 무시
      // passive: false로 설정하여 방어 함수를 강력하게 적용합니다.
      document.addEventListener('touchmove', preventDefault, { passive: false });
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = 'auto';
      document.removeEventListener('touchmove', preventDefault);
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = 'auto';
      document.removeEventListener('touchmove', preventDefault);
    };
  }, [selectedPhotoIndex, showMapImage, showIntro]);

// 👇 2. 인트로 타이머 (1.5초 뒤에 커튼을 엽니다) 및 스크롤 강제 잠금 👇
  useEffect(() => {
    if (showIntro) {
      document.body.style.overflow = 'hidden'; // 인트로 재생 중엔 스크롤 불가
      
      const timer = setTimeout(() => {
        setShowIntro(false); // 1.5초 뒤에 인트로 종료
      }, 1500);
      
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = 'unset'; // 인트로 끝나면 스크롤 해제
    }
  }, [showIntro]);


  // 2026년 6월 달력 데이터 (6월 1일은 월요일)
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  const calendarDays = [
    null, 1, 2, 3, 4, 5, 6,
    7, 8, 9, 10, 11, 12, 13,
    14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27,
    28, 29, 30
  ];


// 👇 버튼 클릭 핸들러 추가 👇

  // 1. 네이버 지도: 앱 없으면 -> 모바일 웹 길찾기로 이동
  const handleNaverMap = () => {
    // 앱 호출용 스킴 (도착지: 인터불고 엑스코)
    const scheme = `nmap://route/public?dlat=35.9069985378003&dlng=128.611285546387&dname=${encodeURIComponent('호텔 인터불고 엑스코')}&appname=wedding`;
    
    // 👇 도착지가 완벽하게 입력되는 '신형 네이버 지도 웹 URL' (출발지 텅 빈칸, 도착지 세팅 완료)
    const fallbackWebUrl = `https://map.naver.com/p/directions/-/128.611285546387,35.9069985378003,${encodeURIComponent('호텔 인터불고 엑스코')}/-/car`;

    window.location.href = scheme;

    setTimeout(() => {
      // 0.5초 뒤에도 브라우저가 화면에 활성화되어 있다면 (앱이 열리지 않음)
      if (!document.hidden) {
        window.open(fallbackWebUrl, '_blank');
      }
    }, 500);
  };

  // 2. 티맵: 앱 없으면 -> 앱스토어/플레이스토어로 이동
  const handleTmap = () => {
    const scheme = 'tmap://route?goalname=호텔 인터불고 엑스코&goalx=128.611285546387&goaly=35.9069985378003';
    
    // 사용자의 기기가 안드로이드인지 아이폰인지 판별
    const isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1;
    const storeUrl = isAndroid 
      ? "market://details?id=com.skt.tmap.ku" // 안드로이드 플레이스토어
      : "https://apps.apple.com/kr/app/id431589174"; // 아이폰 앱스토어

    window.location.href = scheme;

    setTimeout(() => {
      if (!document.hidden) {
        window.open(storeUrl, '_blank');
      }
    }, 500);
  };

// 계좌번호 복사 관련
const handleCopy = (account: string) => {
    // 띄어쓰기나 '-' 기호를 빼고 숫자만 깔끔하게 복사되도록 합니다 (옵션)
    const cleanAccount = account.replace(/[^0-9]/g, '');
    navigator.clipboard.writeText(cleanAccount).then(() => {
      alert('계좌번호가 복사되었습니다.');
    }).catch(() => {
      alert('복사를 지원하지 않는 브라우저입니다. 직접 길게 눌러 복사해 주세요.');
    });
  };

// 👇 1. 카카오톡 SDK 초기화 (앱이 켜질 때 한 번만 실행) 👇
  useEffect(() => {
    // window 객체에 Kakao가 있고, 아직 초기화되지 않았다면 실행합니다.
    if (typeof window !== 'undefined' && window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init('56f7bc15851d93fc13f4329030ee37fe'); // 🚨 주의: 나중에 꼭 본인의 키로 바꿔야 합니다!
    }
  }, []);

  // 👇 2. 카카오톡 공유하기 버튼 함수 👇
  const handleKakaoShare = () => {
    if (typeof window !== 'undefined' && window.Kakao && window.Kakao.isInitialized()) {
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: '장상엽 ♥ 박진솔 결혼합니다',
          description: '2026년 6월 7일 일요일 12시 30분\n호텔 인터불고 엑스코 2층 그랑파티오',
          // 카톡 채팅방에 보일 메인 썸네일 이미지 (절대 경로 필수)
          imageUrl: 'https://yeop-n-sol.vercel.app/images/main.jpg', 
          link: {
            mobileWebUrl: 'https://yeop-n-sol.vercel.app',
            webUrl: 'https://yeop-n-sol.vercel.app',
          },
        },
        buttons: [
          {
            title: '모바일 청첩장 보기',
            link: {
              mobileWebUrl: 'https://yeop-n-sol.vercel.app',
              webUrl: 'https://yeop-n-sol.vercel.app',
            },
          },
        ],
      });
    } else {
      alert('카카오톡 공유 기능을 불러오는 중입니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  // 👇 3. 청첩장 링크 복사 버튼 함수 👇
  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://yeop-n-sol.vercel.app').then(() => {
      alert('청첩장 링크가 복사되었습니다! 카카오톡이나 문자로 공유해 보세요.');
    }).catch(() => {
      alert('복사를 지원하지 않는 브라우저입니다. 주소창의 링크를 직접 복사해 주세요.');
    });
  };



  return (
    // 변경 후 (우클릭 방지 이벤트 및 Tailwind CSS 선택 방지 클래스 추가)
	<main 
		className="min-h-screen bg-[#FDFDFD] text-[#333333] selection:bg-rose-100 relative select-none [&_img]:pointer-events-none"
		onContextMenu={(e) => e.preventDefault()} // 우클릭 방지
	>
	
	
	{/* 🌟 진짜 꽃잎들이 하트 모양 테두리를 이루는 오프닝 인트로 (통째로 덮어쓰기) 🌟 */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="intro-splash"
            className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden touch-none"
            exit={{ backgroundColor: "rgba(255,255,255,0)", transition: { delay: 0.8 } }} 
          >
            {/* 하얀색 좌우 커튼 (기존 코드 동일) */}
            <motion.div variants={curtainLeftVariants} initial="initial" animate="animate" exit="exit" className="absolute top-0 left-0 bottom-0 w-1/2 bg-white z-10 shadow-[5px_0_30px_rgba(0,0,0,0.05)]" />
            <motion.div variants={curtainRightVariants} initial="initial" animate="animate" exit="exit" className="absolute top-0 right-0 bottom-0 w-1/2 bg-white z-10 shadow-[-5px_0_30px_rgba(0,0,0,0.05)]" />

            {/* 👇 1. 커튼 위에 뜨는 글자와 흩날리는 하트 꽃잎 (z-20) 👇 */}
            <motion.div className="relative z-20 flex items-center justify-center pointer-events-none">
              
              {/* ✨ 디테일 1: 글자와 커튼 갈라지는 선이 난잡해 보이지 않도록 뒤에 뽀얀 블러 방어막 전개 ✨ */}
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute w-[300px] h-[250px] bg-white/70 rounded-full" 
                style={{ filter: 'blur(30px)' }} 
              />

              {/* ✨ 디테일 2: 형형색색 진짜 꽃잎들이 그리는 하트 테두리 ✨ */}
              <div className="absolute inset-0 flex items-center justify-center">
                {heartPetals.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }} // 글자 가운데서 뿜어져 나옴
                    animate={{ 
                      opacity: 1, scale: p.scale, x: p.x, y: p.y, rotate: p.rotation,
                      transition: { duration: 0.8, delay: 0.3 + p.delay, type: 'spring', damping: 12 }
                    }}
                    exit={{ 
                      // 👇 🌟 최종 수정 포인트 🌟 👇
                      // 동그라미로 뭉개지지 않도록, opacity를 부드럽게 배열로 주고, 스케일도 덜 줄입니다. 
                      opacity: [1, 0.5, 0], // 깜빡이지 않고 서서히 투명해짐
                      scale: 0.5, // 덜 축소시켜 Teardrop 모양 유지
                      
                      x: p.x + p.scatterX, y: p.y + p.scatterY, rotate: p.rotation + p.scatterRot, // 🌬️ 바람에 촤라락 흩날리는 위치로 이동!
                      transition: { duration: 1.5, ease: "easeOut" } // 날아가는 속도를 1.5초로 늘려 Teardrop 모양이 서서히 흩어지는 디테일을 감상!
                    }}
                    className="absolute w-6 h-6"
                  >
                    {/* 👇 Teardrop 모양의 진짜 꽃잎 SVG 👇 */}
                    <RealPetalSVG color={p.color} />
                  </motion.div>
                ))}
              </div>

              {/* ✨ 디테일 3: 중앙 텍스트 영역 ✨ */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                // exit: 글자도 커튼 열리는 속도(0.8초)에 맞춰 0.8초 뒤에 서서히 사라짐
                exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)', transition: { duration: 0.8, delay: 0.8 } }}
                transition={{ duration: 1.0, delay: 0.3 }}
                className="relative z-30 flex flex-col items-center justify-center text-center px-10"
              >
                <p className="text-xs tracking-[0.4em] text-rose-400 mb-6 font-medium drop-shadow-md">
                  SANGYEOP & JINSOL
                </p>
                <h1 className="text-3xl font-serif tracking-widest text-gray-800 leading-snug drop-shadow-md">
                  We are<br />
                  <span className="italic font-light">Getting Married!</span>
                </h1>
                <div className="w-[80px] h-[1px] bg-gray-400 mt-10 mx-auto" />
              </motion.div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* 🌟 인트로 스플래시 끝 🌟 */}
	

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
				className="relative z-20 flex flex-col items-center justify-start pt-14 px-8 text-center pointer-events-none"
				style={{
					minHeight: 'calc(var(--vh, 1vh) * 100)',
					willChange: 'transform',           // ✅ 추가
					backfaceVisibility: 'hidden',      // ✅ 추가
					WebkitBackfaceVisibility: 'hidden' // ✅ 추가
						}}
			>
              <h1 className="text-3xl font-point tracking-[0.22em] mb-4 text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.8),0_2px_8px_rgba(0,0,0,0.6)]">
                우리, 결혼합니다
              </h1>
              <div className="w-[1px] h-10 bg-white/90 mx-auto mb-5 [box-shadow:0_0_6px_rgba(0,0,0,0.4)]" />
              <p className="text-2xl font-point font-medium text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.8),0_2px_6px_rgba(0,0,0,0.5)]">
                장상엽 <span className="text-lg font-normal text-white/95 mx-1">그리고</span> 박진솔
              </p> 
              <p className="text-sm font-normal text-white/95 leading-relaxed mt-4 [text-shadow:0_1px_2px_rgba(0,0,0,0.7),0_2px_4px_rgba(0,0,0,0.5)]">
                2026년 6월 7일 일요일 12시 30분<br />
                호텔 인터불고 엑스코 2층 그랑파티오
              </p>
            </div>
          </FadeIn>
        </section>

        {/* 메인 커버 뒤에서 공간을 차지해주는 더미 div */}
        {/* 수정 전: h-[100svh] 제거하고 style 추가 */}
        <div 
          className="relative z-0 shrink-0 pointer-events-none" 
          style={{ height: 'calc(var(--vh, 1vh) * 100)' }} 
          aria-hidden="true" 
        />

        {/* 2. 초대글 섹션 */}
        <section className="relative z-10 -mt-px py-24 px-8 text-center bg-[#FAFAFA]">
          <FadeIn>
            <h2 className="text-lg tracking-[0.3em] text-rose-400 mb-10 font-medium whitespace-nowrap">초 대 의 말</h2>
            <p className="font-point2 leading-[1.6] text-[17px] mb-8">
              세상에 와 그대를 만난 건<br />
              내게 얼마나 행운이었나<br />
              그대 생각 내게 머물므로<br />
			  나의 세상은 빛나는 세상이 됩니다<br /> </p>
			  <p className="font-point2 leading-[0] text-[17px] mb-10">
			  - 나태주, &lt;들길을 걸으며&gt; -
              </p>
			              
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.1 }} 
              transition={{ duration: 0.8 }}
              // 👇 1. 가로형 원본 사진이 가장 예쁘게 담기는 3:2 비율의 액자로 변경 👇
              className="relative w-full aspect-[3/2] mx-auto mb-8 rounded-2xl overflow-hidden shadow-sm"
            >
              <Image
                src="/images/sub_main3_v2.jpg?v=4" /* 👈 준비하신 가로형 스냅 사진 파일명으로 변경하세요 */
                alt="lovers"
                fill
                quality={80} // 스크롤 시 로딩되므로 적절한 압축률 적용
                className="object-cover object-center"
                sizes="(max-w: 480px) 100vw, 480px"
              />
            </motion.div>
            
			<p className="font-point leading-[1.8] text-[16px] mb-5 whitespace-nowrap break-keep">
              귀한 걸음 하시어 두 사람의 빛나는 시작을<br />
              기쁜 마음으로 축복해주시면 감사하겠습니다
            </p>
			
            <div className="flex justify-center items-center text-[18px] font-point2 font-normal">
			{/* 왼쪽: 부모님 성함 */}
				<div className="text-right text-gray-700 leading-relaxed">
					<p>장규암 &middot; 라말분</p>
					<p className="mt-1">박주득 &middot; 서정남</p>
				</div>

			{/* 오른쪽: 관계 및 신랑신부 성함 */}
			<div className="text-left leading-relaxed">
					<p className="flex items-baseline">
					<span className="text-[13px] text-gray-400 w-[5px] text-center">의</span>
					<span className="text-[13px] text-gray-400 w-[55px] text-center">아들</span>
					<span className="font-bold text-gray-900">장상엽</span>
					</p>
					<p className="mt-1 flex items-baseline">
					<span className="text-[13px] text-gray-400 w-[5px] text-center">의</span>
					<span className="text-[13px] text-gray-400 w-[55px] text-center">딸</span>
					<span className="font-bold text-gray-900">박진솔</span>
					</p>
				</div>
			</div>
          </FadeIn>
        </section>


{/* 🌟 새로 추가된 3. WEDDING DATE 섹션 🌟 */}
        <section className="relative z-10 -mt-px py-24 px-8 text-center bg-white lining-nums tabular-nums">
          <FadeIn>
            <h2 className="text-lg tracking-[0.3em] text-rose-400 mb-10 font-medium whitespace-nowrap">예 식 일 시</h2>
            
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
                src="/images/sub_date.jpg?v=3" /* 👈 준비하신 가로형 스냅 사진 파일명으로 변경하세요 */
                alt="골목길 스냅이에욥"
                fill
                quality={80} // 스크롤 시 로딩되므로 적절한 압축률 적용
                className="object-cover object-center"
                sizes="(max-w: 480px) 100vw, 480px"
              />
            </motion.div>
            {/* 👆 추가된 스냅 사진 끝 👆 */}

            
            {/* 3 & 4. 실시간 카운트다운 및 동적 메시지 */}
{isMounted && (() => {
  const now = new Date();
  const target = new Date('2026-06-07T12:30:00+09:00');
  
  // 날짜만 비교하기 위해 시간 정보를 제거한 객체 생성
  const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const weddingDate = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
  
  const dateDiff = weddingDate - todayDate;
  const dayCount = Math.floor(dateDiff / (1000 * 60 * 60 * 24));

  let dDayText = "";
  let descriptionText: React.ReactNode = "";

  if (dayCount > 0) {
    // 결혼식 전
    dDayText = `D - ${dayCount}`;
    descriptionText = (
      <>
        상엽 <span className="text-rose-400 text-xs mx-0.5">♥</span> 진솔의 결혼식이{' '}
        {/* 👇 '00일 남았습니다.'를 한 덩어리로 묶어 절대 줄바꿈이 안 되게 막습니다 👇 */}
        <span className="whitespace-nowrap">
          <span className="text-rose-500 font-bold lining-nums tabular-nums">{dayCount}일</span> 남았습니다.
        </span>
      </>
    );
  } else if (dayCount === 0) {
    // 결혼식 당일
    dDayText = "D-DAY";
    descriptionText = (
      <>
        축하해주세요!{' '}
        <span className="whitespace-nowrap">
          <span className="text-rose-500 font-bold text-lg">오늘</span>은 두 사람의 결혼식입니다.
        </span>
      </>
    );
  } else {
    // 결혼식 후
    const passedDays = Math.abs(dayCount);
    dDayText = `D+${passedDays}`;
    descriptionText = (
      <>
        상엽 <span className="text-rose-400 text-xs mx-0.5">♥</span> 진솔이 함께한 지{' '}
        <span className="whitespace-nowrap">
          <span className="text-rose-500 font-bold">{passedDays}일</span> 되었습니다.
        </span>
      </>
    );
  }

  return (
    <div className="bg-[#FAFAFA] rounded-2xl p-6 shadow-sm border border-gray-100">
      {/* 상단 D-DAY 표시 */}
      <div className="text-2xl font-bold text-rose-500 mb-4 tracking-tighter font-sans lining-nums tabular-nums">
        {dDayText}
      </div>

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
      <p className="text-[15px] text-gray-600 font-medium mt-2 break-keep">
        {descriptionText}
      </p>
    </div>
  );
})()}
          </FadeIn>
        </section>
		
        {/* 4. 장소 안내 섹션 (배경색 교차를 위해 #FAFAFA로 변경) */}
        <section className="relative z-10 -mt-px py-24 px-8 text-center bg-[#FAFAFA]">
          <FadeIn>
            <h2 className="text-lg tracking-[0.3em] text-rose-400 mb-10 font-medium whitespace-nowrap">오 시 는 길</h2>
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
			
			{/* 👇 수정된 네비게이션 버튼 영역 👇 */}
			<div className="flex justify-between gap-2">
  
			    {/* 1. 네이버 지도 */}
				<button 
				onClick={handleNaverMap} // 👈 함수 연결
				className="flex-1 bg-white py-2.5 rounded-lg flex items-center justify-center gap-1.5 font-medium text-[13px] border border-gray-200 shadow-sm transition-colors active:bg-gray-50 text-gray-700"
				>
				  <Image src="/images/icon-naver.png?v=2" alt="네이버 지도" width={18} height={18} className="rounded-[4px]" />
				  네이버지도
				</button>

				{/* 2. 티맵 */}
				<button 
				onClick={handleTmap} // 👈 함수 연결
				className="flex-1 bg-white py-2.5 rounded-lg flex items-center justify-center gap-1.5 font-medium text-[13px] border border-gray-200 shadow-sm transition-colors active:bg-gray-50 text-gray-700"
				>
				  <Image src="/images/icon-tmap.png?v=2" alt="티맵" width={18} height={18} className="rounded-[4px]" />
				  티맵
				  </button>

                {/* 3. 카카오내비 (웹/앱 자동연결 링크) */}
                <button 
                  onClick={() => window.open('https://map.kakao.com/link/to/호텔 인터불고 엑스코,35.9069985378003,128.611285546387')}
                  className="flex-1 bg-white py-2.5 rounded-lg flex items-center justify-center gap-1.5 font-medium text-[13px] border border-gray-200 shadow-sm transition-colors active:bg-gray-50 text-gray-700"
                >
                  <Image src="/images/icon-kakao.png?v=2" alt="카카오내비" width={18} height={18} className="rounded-[4px]" />
                  카카오내비
                </button>
              </div>            
            {/* 👆 네비게이션 연동 섹션 끝 👆 */}
			
			
			
          </FadeIn>
        </section>
		
		
		{/* 🌟 5. 갤러리 (GALLERY) 섹션 (지그재그 순서 복귀!) 🌟 */}
        <section className="relative z-10 -mt-px py-24 px-6 bg-white text-center">
          <FadeIn>
            <h2 className="text-lg tracking-[0.3em] text-rose-400 mb-10 font-medium whitespace-nowrap">웨 딩 사 진</h2>
          </FadeIn>
            
          {/* 지그재그(1 2, 3 4) 순서를 강제하는 Flexbox 2단 레이아웃 */}
          <div className="flex gap-3 mb-8 items-start w-full">
            
            {/* 왼쪽 기둥 (1, 3, 5, 7... 홀수 번째 사진들) */}
            <div className="flex-1 flex flex-col gap-3">
              {displayedPhotos.filter((_, i) => i % 2 === 0).map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "50px" }}
                  transition={{ duration: 0.4 }}
                  className={`relative w-full ${photo.aspect} bg-gray-100 rounded-xl overflow-hidden shadow-sm cursor-pointer transform transition-transform active:scale-95`}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                  onClick={() => setSelectedPhotoIndex(photo.id)}
                >
                  <Image
                    src={photo.src}
                    alt={`웨딩 갤러리 사진 ${photo.id + 1}`}
                    fill
                    quality={60} 
                    priority={index < 2} // 상위 2장 미리 로딩
                    className="object-cover"
                    sizes="(max-w: 480px) 50vw, 240px"
                  />
                </motion.div>
              ))}
            </div>

            {/* 오른쪽 기둥 (2, 4, 6, 8... 짝수 번째 사진들) */}
            <div className="flex-1 flex flex-col gap-3">
              {displayedPhotos.filter((_, i) => i % 2 === 1).map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "50px" }}
                  transition={{ duration: 0.4 }}
                  className={`relative w-full ${photo.aspect} bg-gray-100 rounded-xl overflow-hidden shadow-sm cursor-pointer transform transition-transform active:scale-95`}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                  onClick={() => setSelectedPhotoIndex(photo.id)}
                >
                  <Image
                    src={photo.src}
                    alt={`웨딩 갤러리 사진 ${photo.id + 1}`}
                    fill
                    quality={60} 
                    priority={index < 2} 
                    className="object-cover"
                    sizes="(max-w: 480px) 50vw, 240px"
                  />
                </motion.div>
              ))}
            </div>

          </div>

          {/* 👇 2. 화면엔 안 보이지만 브라우저가 몰래 사진을 다운로드하는 '투명 망토' 영역 👇 */}
          {!showAllGallery && preloadGallery && (
            <div className="absolute w-[1px] h-[1px] overflow-hidden opacity-0 pointer-events-none -z-10">
              {galleryPhotos.slice(6, 12).map((photo) => (
                <Image
                  key={`preload-${photo.id}`}
                  src={photo.src}
                  alt="preload"
                  fill
                  quality={60}
                  sizes="(max-w: 480px) 50vw, 240px"
                />
              ))}
            </div>
          )}

          {/* 더보기 및 접기 버튼 (토글) */}
          <FadeIn>
            <button
              onClick={() => setShowAllGallery(!showAllGallery)}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gray-50 text-gray-600 rounded-full font-medium text-[15px] border border-gray-200 transition-colors active:bg-gray-100 mt-4"
            >
              {showAllGallery ? (
                <>
                  <ChevronUp size={18} className="animate-pulse text-gray-400" />
                  접기
                </>
              ) : (
                <>
                  <ChevronDown size={18} className="animate-pulse text-gray-400" />
                  더 보기
                </>
              )}
            </button>
          </FadeIn>
            
        </section>
		
		{/* 🌟 새로 추가된 6. 안내 사항 (INFORMATION) 섹션 🌟 */}
        <section className="relative z-10 -mt-px py-24 px-8 bg-[#FAFAFA] text-center">
          <FadeIn>
            <h2 className="text-lg tracking-[0.3em] text-rose-400 mb-10 font-medium whitespace-nowrap">알 리 는 말</h2>
          </FadeIn>

          {/* 1. 식사 안내 카드 */}
          <FadeIn delay={0.1}>
            <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 mb-6">
              <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-400">
                <Utensils size={24} strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-gray-800 text-[17px] mb-4 font-point whitespace-nowrap">식사 안내</h3>
              <p className="text-[14px] text-gray-600 leading-[1.8] break-keep">
                정성껏 준비한 식사는 예식장과 동일한<br />
				<span className="text-rose-500 font-medium whitespace-nowrap">2층 연회장 라그라나</span>에서<br />
                맛있게 즐기실 수 있습니다.<br />
                <br />
                당일 예식 상황에 따라 식사 공간이<br />
                다소 혼잡할 수 있는 점,<br />
                하객 여러분들의 너른 양해를 부탁드립니다.
              </p>
            </div>
          </FadeIn>

          {/* 2. 화환 안내 카드 */}
          <FadeIn delay={0.2}>
            <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
              <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-400">
                <Flower2 size={24} strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-gray-800 text-[17px] mb-4 font-point whitespace-nowrap">축하 화환 안내</h3>
              <p className="text-[14px] text-gray-600 leading-[1.8] break-keep">
                호텔 인터불고 엑스코의 예식 규정상<br />
                <span className="font-medium text-gray-800 whitespace-nowrap">대형 축하 화환은 반입이 불가</span>합니다.<br />
                <br />
                두 사람의 시작을 축하해 주실 분들께서는<br />
                <span className="text-rose-500 font-medium whitespace-nowrap">꽃바구니나 화분</span>으로 보내주시면<br />
                더욱 감사한 마음으로 간직하겠습니다.
              </p>
            </div>
          </FadeIn>
        </section>
		

        {/* 🌟 7. 마음 전하실 곳 섹션 🌟 */}
        <section className="relative z-10 -mt-px py-24 px-8 bg-white">
          <FadeIn>
            <h2 className="text-sm tracking-[0.3em] text-rose-400 mb-10 text-center font-medium whitespace-nowrap">마음 전하실 곳</h2>
            <p className="text-center text-sm text-gray-500 mb-10 leading-relaxed break-keep">
              참석이 어려우신 분들을 위해<br />
              계좌번호를 기재하였습니다.<br />
              너그러이 양해 부탁드립니다.
            </p>

            {/* 1. 신랑측 계좌 */}
            <div className="mb-5">
              <button 
                onClick={() => setOpenAccount(openAccount === 'groom' ? null : 'groom')}
                className="w-full bg-white border border-gray-200 py-4 px-6 rounded-lg flex justify-between items-center text-[16px] font-medium transition-colors active:bg-gray-50 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
              >
                {/* 👇 신랑측은 듬직하고 차분한 블루톤 적용 👇 */}
                <span className="text-blue-500">신랑측</span>
                <span className="text-gray-400">
                  {openAccount === 'groom' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </span>
              </button>
              
              <AnimatePresence>
                {openAccount === 'groom' && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: 'auto', opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }}
                    // overflow-hidden이 있어야 열리고 닫힐 때 높이 애니메이션이 부드럽습니다
                    className="overflow-hidden bg-gray-50 border-x border-b border-gray-200 rounded-b-lg text-[14px]"
                  >
                    <div className="p-6 flex flex-col gap-1">
                      
                      {/* 신랑 아버지 */}
                      <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                        <div>
                          <p className="text-blue-500 text-[13px] mb-1 font-medium">신랑 아버지</p>
                          <p className="font-medium text-gray-800 tracking-wide">농협  123-4567-8901-23  장규암</p>
                        </div>
                        <button 
                          onClick={() => handleCopy('1234567890123')} // 실제 복사될 계좌번호 숫자 입력
                          className="shrink-0 flex items-center gap-1.5 text-[12px] bg-white border border-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-50 text-gray-600 active:scale-95 transition-transform"
                        >
                          <Copy size={14} /> 복사
                        </button>
                      </div>

                      {/* 신랑 어머니 */}
                      <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                        <div>
                          <p className="text-blue-500 text-[13px] mb-1 font-medium">신랑 어머니</p>
                          <p className="font-medium text-gray-800 tracking-wide">대구은행  133-08-244-748  라말분</p>
                        </div>
                        <button 
                          onClick={() => handleCopy('1234567890123')}
                          className="shrink-0 flex items-center gap-1.5 text-[12px] bg-white border border-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-50 text-gray-600 active:scale-95 transition-transform"
                        >
                          <Copy size={14} /> 복사
                        </button>
                      </div>

                      {/* 신랑 본인 */}
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-blue-500 text-[13px] mb-1 font-medium">신랑</p>
                          <p className="font-medium text-gray-800 tracking-wide">농협은행  352-02785192-43  장상엽</p>
                        </div>
                        <button 
                          onClick={() => handleCopy('1234567890123')}
                          className="shrink-0 flex items-center gap-1.5 text-[12px] bg-white border border-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-50 text-gray-600 active:scale-95 transition-transform"
                        >
                          <Copy size={14} /> 복사
                        </button>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>


            {/* 2. 신부측 계좌 */}
            <div>
              <button 
                onClick={() => setOpenAccount(openAccount === 'bride' ? null : 'bride')}
                className="w-full bg-white border border-gray-200 py-4 px-6 rounded-lg flex justify-between items-center text-[16px] font-medium transition-colors active:bg-gray-50 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
              >
                {/* 👇 신부측은 따뜻하고 화사한 로즈톤 적용 👇 */}
                <span className="text-rose-500">신부측</span>
                <span className="text-gray-400">
                  {openAccount === 'bride' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </span>
              </button>
              
              <AnimatePresence>
                {openAccount === 'bride' && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: 'auto', opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-gray-50 border-x border-b border-gray-200 rounded-b-lg text-[14px]"
                  >
                    <div className="p-6 flex flex-col gap-1">
                      
                      {/* 신부 아버지 */}
                      <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                        <div>
                          <p className="text-rose-500 text-[13px] mb-1 font-medium">신부 아버지</p>
                          <p className="font-medium text-gray-800 tracking-wide">대구 123-4567-8901-23 박주득</p>
                        </div>
                        <button 
                          onClick={() => handleCopy('1234567890123')}
                          className="shrink-0 flex items-center gap-1.5 text-[12px] bg-white border border-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-50 text-gray-600 active:scale-95 transition-transform"
                        >
                          <Copy size={14} /> 복사
                        </button>
                      </div>

                      {/* 신부 어머니 */}
                      <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                        <div>
                          <p className="text-rose-500 text-[13px] mb-1 font-medium">신부 어머니</p>
                          <p className="font-medium text-gray-800 tracking-wide">우리 123-4567-8901-23 서정남</p>
                        </div>
                        <button 
                          onClick={() => handleCopy('1234567890123')}
                          className="shrink-0 flex items-center gap-1.5 text-[12px] bg-white border border-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-50 text-gray-600 active:scale-95 transition-transform"
                        >
                          <Copy size={14} /> 복사
                        </button>
                      </div>

                      {/* 신부 본인 */}
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-rose-500 text-[13px] mb-1 font-medium">신부</p>
                          <p className="font-medium text-gray-800 tracking-wide">카카오뱅크 123-4567-8901-23 박진솔</p>
                        </div>
                        <button 
                          onClick={() => handleCopy('1234567890123')}
                          className="shrink-0 flex items-center gap-1.5 text-[12px] bg-white border border-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-50 text-gray-600 active:scale-95 transition-transform"
                        >
                          <Copy size={14} /> 복사
                        </button>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
          </FadeIn>
        </section>

        {/* 👇 카카오톡 공유 기능을 위한 필수 스크립트 로드 👇 */}
        <Script 
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js" 
          integrity="sha384-TiCmbV6AjoJiF4V/W5jcRfsN8Bf8tG7F8bZqD0+zD31Q1g/Q1a4Fv6H0Aom/QeR" 
          crossOrigin="anonymous" 
          strategy="lazyOnload"
        />

        {/* 🌟 8. 푸터 🌟 */}
        <footer className="relative z-10 -mt-px py-12 bg-white text-center border-t border-gray-50">
          <FadeIn>
            <div className="flex justify-center gap-15 mb-8">
              
              {/* 카카오톡 공유 버튼 */}
              <button 
                onClick={handleKakaoShare}
                className="flex flex-col items-center gap-2 text-[13px] font-medium text-gray-600 active:scale-95 transition-transform"
              >
                <div className="w-14 h-14 bg-[#FEE500] rounded-full flex items-center justify-center text-black shadow-sm">
                  <MessageCircle size={22} fill="currentColor" />
                </div>
                카카오톡 공유
              </button>

              {/* 링크 복사 버튼 */}
              <button 
                onClick={handleCopyLink}
                className="flex flex-col items-center gap-2 text-[13px] font-medium text-gray-600 active:scale-95 transition-transform"
              >
                <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-gray-500 shadow-sm">
                  <Copy size={22} />
                </div>
                청첩장 복사
              </button>

            </div>
            
            <p className="text-[11px] text-gray-400 tracking-[0.15em] font-medium">
              &copy; 2026. Yeop & Sol. H-E-A
            </p>
          </FadeIn>
        </footer>

      </div>


	  {/* 👇 갤러리 라이트박스 (확대 모달) 👇 */}
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
            {/* 👇 새로 추가: 사용자가 사진을 보는 동안, 몰래 '다음'과 '이전' 사진을 고화질로 다운로드합니다 👇 */}
            <div className="absolute w-[1px] h-[1px] overflow-hidden opacity-0 pointer-events-none -z-10">
              <Image 
                src={galleryPhotos[lightboxNextIndex].src} 
                alt="preload next" 
                fill 
                unoptimized 
                priority // 당장 화면엔 안 보이지만 가장 최우선으로 다운로드하라는 강력한 명령!
              />
              <Image 
                src={galleryPhotos[lightboxPrevIndex].src} 
                alt="preload prev" 
                fill 
                unoptimized 
                priority 
              />
            </div>
            {/* 👆 프리로딩 영역 끝 👆 */}

            {/* 닫기 버튼 (기존 코드 동일) */}
            <button 
              onClick={() => setSelectedPhotoIndex(null)}
              className="absolute top-6 right-6 text-white/80 p-2 z-[210] active:scale-90"
            >
              <X size={28} strokeWidth={2} />
            </button>

            {/* 메인 이미지 (스와이프 기능 포함) */}
            {/* 👇 사진 전환 시 깜빡임(Flicker)을 완벽히 방지하는 스와이프 컨테이너 👇 */}
            {/* 👇 수정 후: h-[75dvh]를 제거하고, style에 절대 변하지 않는 커스텀 vh를 적용합니다! 👇 */}
            <div 
              className="relative w-full max-w-[480px] flex items-center justify-center overflow-hidden"
              style={{ height: 'calc(var(--vh, 1vh) * 75)' }}
            >
              <AnimatePresence mode="wait">
                <motion.div 
                  key={selectedPhotoIndex}
                  // x축 이동 거리를 줄이고, 약간의 스케일 변화를 주어 인스타그램처럼 부드럽게 넘깁니다
                  initial={{ opacity: 0, scale: 0.98, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.98, x: -20 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }} // 통통 튀는 spring 대신 차분한 easeInOut 적용
                  className="absolute inset-0 touch-pan-x"
                  drag="x" 
                  dragConstraints={{ left: 0, right: 0 }} 
                  dragDirectionLock 
                  onDragEnd={(e, { offset }) => {
                    if (offset.x < -50) handleNextPhoto(e as any);
                    else if (offset.x > 50) handlePrevPhoto(e as any);
                  }}
                  onClick={(e) => e.stopPropagation()} 
                >
                  <Image
                    src={galleryPhotos[selectedPhotoIndex].src}
                    alt={`확대된 웨딩 사진 ${selectedPhotoIndex + 1}`}
                    fill
                  // 👇 확대 사진도 로딩 지연이 없도록 unoptimized를 추가합니다 👇
                    unoptimized={true}
                    priority 
                    className="object-contain" 
                  // 👇 핵심: 어떤 모바일 브라우저에서도 원본 비율을 무조건 유지하도록 강제합니다! 👇
                  style={{ objectFit: 'contain' }} 
                  sizes="100vw"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

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
      {/* 👇 1. 약도 이미지를 백그라운드에서 몰래 미리 다운로드(Preload) 해두는 투명 망토 영역 👇 */}
      <div className="hidden">
        <Image 
          src="/images/way_to_hall.jpg?v=2" 
          alt="약도 사전로딩" 
          width={10} 
          height={10} 
          priority 
        />
      </div>
	  
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