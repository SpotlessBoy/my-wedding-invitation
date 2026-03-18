'use client';

import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

// 꽃잎 한 개의 속성을 정의하는 타입
interface Petal {
  id: number;
  x: number; // 초기 X 위치
  size: number; // 크기
  color: string; // 색상 (파스텔 톤)
  fallSpeed: number; // 떨어지는 속도
  flutterAmp: number; // 좌우 흔들림 폭
  rotate: number; // 회전 각도
  baseOpacity: number; // 새로 추가됨: 꽃잎마다 고유의 투명도를 가집니다.
}

// 파스텔 톤의 하트 색상 목록
const pastelColors = ['#FFD1DC', '#FFC0CB', '#FDFD96', '#E4F8E4', '#CFE2F3'];

// 파스텔 톤 대신 빈티지/말린 꽃 색상 팔레트로 교체
const vintageColors = [
  '#FFD1DC', // 파스텔 핑크 (유저 요청: 핑크) - 가장 화사한 톤
  '#FFFFE0', // 라이트 옐로우 (유저 요청: 노랑) - 아주 밝은 레몬 톤
  '#FFDAB9', // 파스텔 오렌지/애프리콧 (유저 요청: 주황) - 부드러운 살구 톤
  '#FFFFF0', // 라이트 화이트/아이보리 (유저 요청: 화이트) - 따뜻하고 화사한 톤
  '#FFB6C1', // 라이트 핑크 (보너스: 더 화사한 핑크)
  '#FFF8DC', // 곤 실크 (보너스: 아이보리 옐로우)
];

// 하트 모양 SVG 꽃잎 컴포넌트
const PetalSVG = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
      fill={color}
    />
  </svg>
);

const VintagePetalSVG = ({ color }: { color: string }) => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.1))' }} // 아주 미세한 그림자로 질감 추가
  >
    <path
      d="M16.5 4.5c-1.8 0-3.3 1-4.5 2.5-1.2-1.5-2.7-2.5-4.5-2.5-3.3 0-6 2.7-6 6 0 4.1 3.5 7.1 8.8 11.5l1.7 1.4 1.7-1.4c5.3-4.4 8.8-7.4 8.8-11.5 0-3.3-2.7-6-6-6z" // 대칭적이고 깨끗한 하트
      fill={color}      
    />
    {/* 불규칙함을 더하기 위해 안쪽에 작은 점이나 스크래치 같은 요소 추가 가능 */}
    <circle cx="12" cy="12" r="0.5" fill="white" opacity="0.3" />
  </svg>
);

export default function PetalRain() {
  const [petals, setPetals] = useState<Petal[]>([]);
  // 터치 위치를 저장하는 상태 (null은 터치 안 함)
  const [touchPosition, setTouchPosition] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. 꽃잎 주기적 생성
  useEffect(() => {
    const intervalId = setInterval(() => {
      // 화면 꽉 차지 않게 생성 제한 (예: 30개)
	  // 👇 setPetals 안에서 prev 상태를 직접 확인하도록 로직을 변경합니다 👇
      setPetals((prev) => {
        if (prev.length < 30) {
          return [
          ...prev,
          {
            id: Date.now(),
            x: Math.random() * window.innerWidth, // 무작위 가로 위치
            // 3. 크기 차이 극대화: 12px(아주 작음)부터 ??px(꽤 큼)까지 무작위로 생성
            size: 12 + Math.random() * 20,
            color: vintageColors[Math.floor(Math.random() * vintageColors.length)], // vintageColors로 변경
            fallSpeed: 10 + Math.random() * 15, // 무작위 속도 (값이 클수록 빠름)
            flutterAmp: 20 + Math.random() * 20, // 무작위 흔들림 폭
            rotate: Math.random() * 360, // 무작위 초기 회전 각도			
            baseOpacity: 0.3 + Math.random() * 0.6, // 4. 투명도 다변화: 0.3(많이 흐릿함)부터 0.9(선명함) 사이의 무작위 값
          },
        ];
      }
        return prev; // 30개 이상이면 기존 배열을 그대로 유지 (아무 일도 안 함)
    });
    }, 700); // 생성 주기도 살짝 당겨서 자연스럽게 이어지도록 함(원래 1.5초마다)

    return () => clearInterval(intervalId);
  }, []); // 👈 의존성 배열을 완전히 비워줍니다! 이제 타이머가 절대 죽지 않습니다.

  // 꽃잎 제거 (화면 밖으로 나가면 삭제)
  const removePetal = (id: number) => {
    setPetals((prev) => prev.filter((p) => p.id !== id));
  };

  // 2. 터치 이벤트 핸들러
  // 터치한 위치의 좌표를 상태에 저장합니다.
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      // 컨테이너 기준 상대 좌표로 계산
      setTouchPosition({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      });
    }
    // 터치 중 스크롤 방지
    if (e.cancelable) e.preventDefault();
  };

  const handleTouchEnd = () => {
    // 터치가 끝나면 위치 정보를 null로 초기화합니다.
    setTouchPosition(null);
  };

  // 터치 상호작용의 작동 원리를 시각적으로 이해하는 데 도움이 되는 다이어그램입니다.
  // 이 다이어그램은 터치 이벤트의 좌표가 어떻게 애니메이션 목표값으로 전달되는지 보여줍니다.
  

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-auto" // 터치 이벤트를 받으려면 pointer-events-auto여야 합니다.
      onTouchStart={handleTouchMove}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'none' }} // 브라우저 기본 터치 동작(스크롤 등) 방지
    >
      {petals.map((petal) => {
        // 터치 여부에 따라 꽃잎의 애니메이션 목표값(x, y)을 동적으로 결정합니다.
        // 터치 중일 때는 y값도 터치 위치로 수렴하게 만들어서 뭉치는 효과를 줍니다.
        const animationYTarget = touchPosition ? touchPosition.y : '120vh'; // 터치 안 할 때는 화면 밖으로

        return (
          // 👇 1. 낙하(y)와 투명도(opacity)만 담당하는 부모 레이어 (이동이 끝나면 즉시 삭제) 👇
          <motion.div
            key={petal.id}
            initial={{ opacity: 0, y: -50, x: petal.x }}
            animate={
              touchPosition
                ? {
                    x: touchPosition.x + (Math.random() - 0.5) * 20,
                    y: animationYTarget,
                    opacity: 1,
                    transition: { type: 'spring', stiffness: 70, damping: 10, mass: 0.5 }
                  }
                : {
                    y: '120vh',
                    opacity: [0, petal.baseOpacity, petal.baseOpacity, 0],
                    transition: { duration: petal.fallSpeed, ease: 'linear' }
                  }
            }
            onAnimationComplete={() => {
              // 부모에는 '무한 반복'이 없으므로, 바닥에 닿으면 정확히 여기서 즉시 삭제됩니다!
              if (!touchPosition) removePetal(petal.id);
            }}
            className="absolute"
            style={{ width: petal.size, height: petal.size, pointerEvents: 'none', zIndex: Math.floor(petal.size) }}
          >
            
            {/* 👇 2. 제자리에서 흔들림과 회전만 담당하는 자식 레이어 (무한 반복) 👇 */}
            <motion.div
              initial={{ scale: 0, rotate: petal.rotate, skewX: 0, x: 0 }}
              animate={
                touchPosition
                  ? { 
                      scale: 1, rotate: petal.rotate + 360, skewX: 0, x: 0,
                      transition: { type: 'spring' } 
                    }
                  : {
                      scale: 1, 
                      rotate: petal.rotate + 360,
                      skewX: [0, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15, 0],
                      x: [0, petal.flutterAmp, -petal.flutterAmp, 0], // 부모 위치를 기준으로 좌우로만 흔들림
                      transition: {
                        scale: { duration: 0.5 },
                        rotate: { duration: petal.fallSpeed, ease: 'linear', repeat: Infinity },
                        skewX: { duration: 3 + Math.random() * 2, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' },
                        x: { duration: 3 + Math.random() * 2, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }
                      }
                    }
              }
              style={{ width: '100%', height: '100%' }}
            >
              <VintagePetalSVG color={petal.color} />
            </motion.div>

          </motion.div>
        );
      })}
    </div>
  );
}