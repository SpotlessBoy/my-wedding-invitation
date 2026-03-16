'use client';

import { useRef } from 'react';
import Script from 'next/script';

export default function NaverMap() {
  const mapElement = useRef<HTMLDivElement>(null);

  const initMap = () => {
    // TypeScript 에러를 방지하기 위해 window.naver를 가져옵니다.
    const naver = (window as any).naver;
    if (!mapElement.current || !naver) return;

    // 대구 인터불고 엑스코의 위도, 경도 좌표입니다.
    const location = new naver.maps.LatLng(35.9069, 128.6131);

    const mapOptions = {
      center: location,
      zoom: 16, // 숫자(1~21)가 클수록 확대됩니다.
      minZoom: 10,
      scaleControl: false,
      mapDataControl: false,
      zoomControl: true, // 줌 컨트롤 버튼 표시
    };

    const map = new naver.maps.Map(mapElement.current, mapOptions);

    // 지도에 붉은색 핀(마커) 꽂기
    new naver.maps.Marker({
      position: location,
      map: map,
    });
  };

  return (
    <>
      {/* ⚠️ 주의: ncpClientId 값은 반드시 본인이 발급받은 키로 변경해야 합니다! */}
      <Script
        strategy="afterInteractive"
        type="text/javascript"
        src="https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=l7bhzkuu66"
        onReady={initMap}
      />
      {/* 지도가 담길 액자 (모서리 둥글게 처리) */}
      <div ref={mapElement} className="w-full h-full rounded-xl shadow-inner border border-gray-100" />
    </>
  );
}