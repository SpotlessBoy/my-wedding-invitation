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
  '#C19A9B', // 빛바랜 장미 (Dusty Rose)
  '#D1AF73', // 빈티지 골드 (Antique Gold)
  '#9A9E7F', // 말린 올리브 (Muted Olive)
  '#8E9EB1', // 빛바랜 블루 (Desaturated Blue)
  '#CFC5B8', // 빈티지 오프화이트 (Pale Taupe)
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
      // 화면 꽉 차지 않게 생성 제한 (예: 25개)
      if (petals.length < 25) {
        setPetals((prev) => [
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
        ]);
      }
    }, 1200); // 생성 주기도 살짝 당겨서 자연스럽게 이어지도록 함(원래 1.5초마다)

    return () => clearInterval(intervalId);
  }, [petals]);

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
          <motion.div
            key={petal.id}
            initial={{
              opacity: 0,
              y: -50, // 화면 위에서 시작
              x: petal.x,
              scale: 0,
              rotate: petal.rotate,
			  skewX: 0,
            }}
            animate={
              touchPosition
                ? {
                    // 터치 중일 때: 손가락 위치로 끌어당김
                    // spring transition을 사용하여 쫄깃하게 따라오는 느낌을 줍니다.
                    x: touchPosition.x + (Math.random() - 0.5) * 20, // 손가락 주변으로 약간 퍼지게
                    y: animationYTarget,
                    opacity: 1,
                    scale: 1,
                    rotate: petal.rotate + 360,
                    transition: {
                      type: 'spring',
                      stiffness: 70,
                      damping: 10,
                      mass: 0.5,
                      // x축은 약간의 지연을 주어 더 자연스럽게 뭉치게
                      x: { delay: Math.random() * 0.1, type: 'spring', stiffness: 50 },
                    },
                  }
                : {
                    // 터치 안 할 때: 터치 안 할 때: 기본 낙하 + 유기적인 비틀림 추가
                    y: '120vh', // 화면 아래로
                    x: [petal.x, petal.x + petal.flutterAmp, petal.x - petal.flutterAmp, petal.x],
                    opacity: [0, petal.baseOpacity, petal.baseOpacity, 0],
                    scale: 1,
                    rotate: petal.rotate + 360,
					// 비틀림(skew) 효과를 무작위로 추가하여 종이가 꼬이는 듯한 느낌을 줍니다.
                    skewX: [
                      0,
                      (Math.random() - 0.5) * 15, // 좌로 비틀림
                      (Math.random() - 0.5) * 15, // 우로 비틀림
                      0,
                    ],
                    transition: {
                      y: {
                        duration: petal.fallSpeed, // 무작위 속도
                        ease: 'linear',
                      },
                      x: {
                        duration: 3 + Math.random() * 2, // 흔들림 속도
                        ease: 'easeInOut',
                        repeat: Infinity,
                        repeatType: 'reverse',
                      },
                      opacity: {
                        duration: petal.fallSpeed,
                        times: [0, 0.1, 0.8, 1], // 끝에 도달하기 전부터 서서히 사라지도록
                      },
					  skewX: {
                        duration: 3 + Math.random() * 2, // 흔들림과 비슷한 주기로
                        ease: 'easeInOut',
                        repeat: Infinity,
                        repeatType: 'reverse',
                      },
                      scale: { duration: 0.5 },
                      rotate: { duration: petal.fallSpeed, ease: 'linear', repeat: Infinity },
                    },
                  }
            }
            // 애니메이션이 끝나거나 터치 위치로 수렴했을 때 (y값이 충분히 크면) 제거합니다.
            onAnimationComplete={() => {
              if (!touchPosition && parseInt(animationYTarget as string) > window.innerHeight) {
                removePetal(petal.id);
              }
            }}
            className="absolute"
            style={{ 
			width: petal.size, 
			height: petal.size, 
			pointerEvents: 'none', // 꽃잎 자체는 터치 안 되게
			zIndex: Math.floor(petal.size) // 6. 보너스 디테일: 크기가 큰 꽃잎일수록 z-index를 높게 주어 더 앞에(가깝게) 있는 것처럼 원근감 표현
			}} 
          >
            <VintagePetalSVG color={petal.color} /> {/* 컴포넌트 이름 변경 */}
          </motion.div>
        );
      })}
    </div>
  );
}