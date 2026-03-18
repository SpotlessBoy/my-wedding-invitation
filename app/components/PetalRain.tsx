'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// 꽃잎 한 개의 속성을 정의하는 타입
interface Petal {
  id: number;
  x: number; // 초기 X 위치
  size: number; // 크기
  color: string; // 색상
  fallSpeed: number; // 떨어지는 속도
  flutterAmp: number; // 좌우 흔들림 폭
  rotate: number; // 회전 각도
  baseOpacity: number; // 꽃잎마다 고유의 투명도
}

// 👇 상엽님 요청: 화사하고 밝은 웨딩용 파스텔 톤 컬러 팔레트 👇
const brightWeddingColors = [
  '#FFD1DC', // 파스텔 핑크
  '#FFFFE0', // 라이트 옐로우
  '#FFDAB9', // 파스텔 오렌지(주황)
  '#FFFFF0', // 라이트 화이트/아이보리
  '#FFB6C1', // 라이트 핑크 (추가)
  '#FFF8DC', // 콘 실크 (추가)
];

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
      d="M16.5 4.5c-1.8 0-3.3 1-4.5 2.5-1.2-1.5-2.7-2.5-4.5-2.5-3.3 0-6 2.7-6 6 0 4.1 3.5 7.1 8.8 11.5l1.7 1.4 1.7-1.4c5.3-4.4 8.8-7.4 8.8-11.5 0-3.3-2.7-6-6-6z"
      fill={color}      
    />
    <circle cx="12" cy="12" r="0.5" fill="white" opacity="0.3" />
  </svg>
);

export default function PetalRain() {
  const [petals, setPetals] = useState<Petal[]>([]);

  // 1. 꽃잎 주기적 생성 (무한 루프)
  useEffect(() => {
    const intervalId = setInterval(() => {
      setPetals((prev) => {
        if (prev.length < 30) {
          return [
            ...prev,
            {
              id: Date.now(),
              x: Math.random() * window.innerWidth,
              size: 12 + Math.random() * 20,
              color: brightWeddingColors[Math.floor(Math.random() * brightWeddingColors.length)], // 화사한 색상 적용
              fallSpeed: 10 + Math.random() * 15,
              flutterAmp: 20 + Math.random() * 20,
              rotate: Math.random() * 360,
              baseOpacity: 0.3 + Math.random() * 0.6,
            },
          ];
        }
        return prev;
      });
    }, 700);

    return () => clearInterval(intervalId);
  }, []); // 👈 의존성 배열 비움 (타이머 죽음 방지)

  // 2. 꽃잎 제거 (좀비 박멸)
  const removePetal = (id: number) => {
    setPetals((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    // 👇 완벽한 투명막(pointer-events-none)으로 터치/스크롤 프리패스 👇
    <div className="absolute inset-0 pointer-events-none">
      {petals.map((petal) => (
        // 👇 A. 부모 레이어: 순수 낙하와 흩뿌려지는 동작, 그리고 확실한 삭제 담당 👇
        <motion.div
          key={petal.id}
          initial={{ opacity: 0, y: -50, x: petal.x }}
          animate={{
            y: '120vh', // 무조건 바닥을 향해 떨어짐
            opacity: [0, petal.baseOpacity, petal.baseOpacity, 0],
          }}
          transition={{ 
            y: { duration: petal.fallSpeed, ease: 'linear' }, 
            opacity: { duration: petal.fallSpeed, times: [0, 0.1, 0.8, 1] } 
          }}
          onAnimationComplete={() => removePetal(petal.id)} // 바닥에 닿으면 즉시 삭제
          className="absolute"
          style={{ width: petal.size, height: petal.size, pointerEvents: 'none', zIndex: Math.floor(petal.size) }}
        >
          {/* 👇 B. 자식 레이어: 무한 반복되는 회전과 흔들림 춤 담당 👇 */}
          <motion.div
            initial={{ scale: 0, rotate: petal.rotate, skewX: 0, x: 0 }}
            animate={{
              scale: 1, 
              rotate: petal.rotate + 360,
              skewX: [0, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15, 0],
              x: [0, petal.flutterAmp, -petal.flutterAmp, 0], 
            }}
            transition={{
              scale: { duration: 0.5 },
              rotate: { duration: petal.fallSpeed, ease: 'linear', repeat: Infinity },
              skewX: { duration: 3 + Math.random() * 2, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' },
              x: { duration: 3 + Math.random() * 2, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }
            }}
            style={{ width: '100%', height: '100%' }}
          >
            <VintagePetalSVG color={petal.color} />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}