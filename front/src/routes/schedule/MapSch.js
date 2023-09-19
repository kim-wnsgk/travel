import React, { useEffect } from "react";
import styles from "./AddSch.module.css";
const { kakao } = window;
function Map() {
    useEffect(() => {

        const container = document.getElementById('map');
        const options = {
            center: new kakao.maps.LatLng(36, 127),//지도의중심좌표
            level: 3
        };
        var map = new kakao.maps.Map(container, options);
        var testAddr = [];
        testAddr[0] = '강원도 강릉시 강동면 괘방산길 16'
        testAddr[1] = '강원도 강릉시 강동면 단경로 841'
        testAddr[2] = '강원도 강릉시 강동면 송담서원길 27-7'
        var points = [];
        var geocoder = new kakao.maps.services.Geocoder();
        Promise.all(
            testAddr.map((address) =>
              new Promise((resolve) => {
                geocoder.addressSearch(address, function (result, status) {
                  if (status === kakao.maps.services.Status.OK) {
                    resolve(new kakao.maps.LatLng(result[0].y, result[0].x));
                  } else {
                    resolve(null); // 에러 발생 시 null로 처리 또는 에러 처리
                  }
                });
              })
            )
          ).then((points) => {
            var bounds = new kakao.maps.LatLngBounds();
        
            points.forEach((point) => {
              if (point) {
                var marker = new kakao.maps.Marker({ position: point });
                marker.setMap(map);
                bounds.extend(point);
              }
            
            });
            map.setBounds(bounds);

            var polyline = new kakao.maps.Polyline({
                path: points, // 선을 구성하는 좌표배열 입니다
                strokeWeight: 5, // 선의 두께 입니다
                strokeColor: '#FFAE00', // 선의 색깔입니다
                strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                strokeStyle: 'solid' // 선의 스타일입니다
            });
            
            // 지도에 선을 표시합니다 
            polyline.setMap(map); 
        });
           
        }, [])

    return (
        <div>
            <div id="map" style={{
                width: '1500px',
                height: '1000px'
            }} />
        </div>
    )
}
export default Map;