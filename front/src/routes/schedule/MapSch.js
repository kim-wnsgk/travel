import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import styles from "./MapSch.module.css";
import axios from "axios";
import useDidMountEffect from '../useDidMountEffect';
import MapDetail from "./MapDetail";

const { kakao } = window;
function Map() {
  const NAVER = process.env.REACT_APP_NAVER_MAP;
  const NAVER_ID = process.env.REACT_APP_NAVER_MAP_ID;
  const location = useLocation().state;
  const [date,setDate] = useState();
  const [schs,setSchs] = useState([]);
  const [selected,setSelected] = useState(location.offset);
  const [addr, setAddr] = useState([]);
  const [curVal, setCurVal] = useState();
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false)
  const [curAddr, setCurAddr] = useState();
  //두 마커 사이의 거리 구하기
  const dist =[]

  function select(index) {
    setSelected(index);
  }
  async function fetchSch() {
    if (location.id) {
      await axios
        .get("http://localhost:3001/schedule/getSchedule", {
          params: {
            id: location.id,
            offset: selected,
          },
        })
        .then(function (response) {
          setSchs(response.data);
        });
    }
  }

  async function getDirection(origin, destination) {
    try {
      const response = await axios.get("http://localhost:3001/schedule/getDirection", {
        params: {
          origin: origin,
          destination: destination
        }
      });
      return [response.data.distance, response.data.duration];
    } catch (error) {
      console.error(error);
      return [null, null];
    }
  }

  async function convertAddr() {
      await axios
        .get("http://localhost:3001/schedule/convertAddr", {
          params: {
            id : location.id,
            offset: selected
          },
        })
        .then(function (response) {
          setAddr(response.data);
        });
    
  }
  useDidMountEffect(()=>{
    if(schs){
    convertAddr()
    }
    else{
      console.log('none')
    }
  },[schs])
  useEffect(()=>{
    fetchSch()
  },[selected])
    useDidMountEffect(() => {
      async function map(){
        const container = document.getElementById('map');
        const options = {
            center: new kakao.maps.LatLng(37.3226546, 127.1260339),//지도의중심좌표
            level: 2,
            zIndex:1
        };
        var map = new kakao.maps.Map(container, options);
        var Addr = [];
      console.log(Object.keys(addr).length === 0)
      if(Object.keys(addr).length === 0){
        console.log("none")
        var iwContent = '<div style="margin:auto;margin-top:20px;text-align:center;height:150px;width:450px;font-size:45px;color:red;padding:5px;"> 아직 일정이 없습니다. <br/>일정을 추가해주세요!</div>',
    iwPosition = new kakao.maps.LatLng(37.3226546, 127.1260339), //인포윈도우 표시 위치입니다
    iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

// 인포윈도우를 생성하고 지도에 표시합니다
var infowindow = new kakao.maps.InfoWindow({
    map: map, // 인포윈도우가 표시될 지도
    position : iwPosition, 
    content : iwContent,
    removable : iwRemoveable
})
      }
        else{
          for (var i = 0; i < addr.length; i++) {
            Addr[i] = addr[i].addr
            console.log(addr[i].addr);
        }
            // Addr[i] = addr[i].addr
      
        var points = [];
        var geocoder = new kakao.maps.services.Geocoder();
        Promise.all(
            Addr.map((address) =>
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
        
              points.forEach((point,index) => {
              if (point) {
                if(index!=0){
                  dist.push(getDirection(`${points[index-1].La},${points[index-1].Ma}`,`${points[index].La},${points[index].Ma}`))
                }
                var marker = new kakao.maps.Marker({ position: point,clickable: true });
                
                marker.setMap(map);
                bounds.extend(point);
                var infowindow = new kakao.maps.InfoWindow({
                  content: `<div style="margin:auto;overflow: hidden;">시간:${schs[index].start}~${schs[index].end}<br/> 장소:${schs[index].sight_id}</div>`
              })
              kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow,index));
              kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));
              kakao.maps.event.addListener(marker, 'click', markerClicked(index));
              }
            });
            map.setBounds(bounds);

            var polyline = new kakao.maps.Polyline({
                path: points, // 선을 구성하는 좌표배열 입니다
                strokeWeight: 5, // 선의 두께 입니다
                strokeColor: '#ff0000', // 선의 색깔입니다
                strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                strokeStyle: 'solid' // 선의 스타일입니다
            });
            Promise.all(dist).then((results)=>{
              console.log(results)
            // 지도에 선을 표시합니다 
            polyline.setMap(map); 
            points.forEach((point,index) => {
              if(point){
              if(index!=0){
                var customOvAd = new kakao.maps.LatLng((points[index].Ma+points[index-1].Ma)/2,(points[index].La+points[index-1].La)/2)
                var customOv = `<div style="margin:auto;background-color:white;border:1px solid black"><span class="left"></span><span class="center">시간 : ${Math.ceil(results[index-1][0]/1000)}km<br>이동거리 : ${Math.ceil(results[index-1][1]/360000)/10}시간</span><span class="right"></span></div>`
                var customOverlay = new kakao.maps.CustomOverlay({
                  position: customOvAd,
                  content: customOv   
              })
              customOverlay.setMap(map);
              }
            }})
          })
        });
      }}
      map()
           
        }, [addr])
        //마우스 오버시
        function makeOverListener(map, marker, infowindow,index) {
          return function() {
              infowindow.open(map, marker);
              setCurVal(index)
          };
      }
      //마우스가 마커를 벗어나면
      function makeOutListener(infowindow) {
          return function() {
              infowindow.close();
              setCurVal(-1)
          };
        }
      //마커 클릭하면
      function markerClicked(index){
        return function(){
          for (var j = 0; j < addr.length; j++) {
            if(schs[index].sight_id == addr[j].title){
              setCurAddr(j)
            }
        }
          setIsOpen(true)
        }
      }
    return (
        <div className={styles.container}>
          {isOpen && <MapDetail setModalOpen={setIsOpen} title={addr[curAddr]?.title} image={addr[curAddr]?.image} contentId={addr[curAddr]?.contentId}/>}
          <div className={styles.headEles}>
          <h1>{location.name} 모임</h1>
          <div className={styles.dates}> 
         {Array.from({ length: location.date }, (_, index) =>(
          index===selected?(
          <button className={styles.selButtons} onClick={()=>select(index)}>{index+1}일차</button>
          ):(
            <button className={styles.selButton}onClick={()=>select(index)}>{index+1}일차</button>
          )
         ))}
         </div>
         </div>
         <div className={styles.mainEles}>
            <div className={styles.map} id="map"/>
            <div className={styles.list}>
            {schs.length === 0 ? (
          <p>아직 일정이 없습니다. 추가해주세요.</p>
        ) : (
          schs.map((item, index) => (index===curVal?(
            <div className={styles.eles}>{index+1}.
              <div className={styles.schduleSite}>장소 : {item.sight_id}</div>
              <div className={styles.schduleTime}>
                일정 시간 : {item.start} ~ {item.end}
              </div>
            </div>):(
              <div className={styles.ele}>{index+1}.
              <div className={styles.schduleSite}>장소 : {item.sight_id}</div>
              <div className={styles.schduleTime}>
                일정 시간 : {item.start} ~ {item.end}
              </div>
            </div>
            )
          ))
        )}
        
            </div>
          </div>
          
        </div>
    )
}
export default Map;