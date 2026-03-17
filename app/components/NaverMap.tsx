'use client';

import { useRef } from 'react';
import Script from 'next/script';

export default function NaverMap() {
  const mapElement = useRef<HTMLDivElement>(null);

  const initMap = () => {
    const naver = (window as any).naver;
    if (!mapElement.current || !naver) return;

    // 대구 인터불고 엑스코 호텔의 정확한 정문 좌표입니다.
    const location = new naver.maps.LatLng(35.906690828677796, 128.6116795015234);

    const mapOptions = {
      center: location,
      zoom: 17, // 조금 더 가깝게 보이도록 17로 조정했습니다.
      minZoom: 10,
      scaleControl: false,
      mapDataControl: false,
      zoomControl: true,
    };

    const map = new naver.maps.Map(mapElement.current, mapOptions);

    // 1. 마커 설정
    const marker = new naver.maps.Marker({
      position: location,
      map: map,
    });

    // 2. 정보창 설정 (마커 클릭 시 혹은 기본으로 표시될 정보)
    const contentString = [
      '<div style="padding:10px; min-width:160px; line-height:150%; text-align:center;">',
      '   <h4 style="margin:0; font-size:14px; color:#333;">호텔 인터불고 엑스코</h4>',
      '   <p style="margin:0; font-size:12px; color:#666;">2층, 그랑파티오</p>',
      '</div>'
    ].join('');

    const infowindow = new naver.maps.InfoWindow({
      content: contentString,
      backgroundColor: "#fff",
      borderColor: "#eee",
      borderWidth: 1,
      anchorSize: new naver.maps.Size(10, 10),
      disableAnchor: false,
      pixelOffset: new naver.maps.Point(0, -5)
    });

    // 지도가 로드되자마자 정보창을 열어둡니다.
    infowindow.open(map, marker);
  };

  return (
    <>
      <Script
        strategy="afterInteractive"
        type="text/javascript"
        src="https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=l7bhzkuu66"
        onReady={initMap}
      />
      <div ref={mapElement} className="w-full h-full rounded-xl shadow-inner border border-gray-100" />
    </>
  );
}