import { Map,useMap, MapMarker } from "react-kakao-maps-sdk"
import { useState,useEffect } from "react"
import styles from "./NearPlace.module.css";
import axios from "axios";
import useDidMountEffect from '../useDidMountEffect';
// import useKakaoLoader from "./useKakaoLoader"

function NearPlace() {
  var selImageSrc = process.env.PUBLIC_URL + '/selMarker.png';
  var imageSrc = process.env.PUBLIC_URL + 'Marker.png';
  const selImageSize ={ width: 60, height: 60 } 
  const imageSize = { width: 40, height: 40 }
  const spriteSize = { width: 36, height: 40 }
  const maxData = 100;//마커 최대 개수
  const [distance, setDistance] = useState(1);
  const [tag,setTag] = useState(1);
  const [datas,setDatas] = useState([]);
  const [state, setState] = useState({center: { lat: 33.450701, lng: 126.570667 }})
  const [level,setLevel] = useState(4)
  const [mPos,setMPos] = useState();

//   useKakaoLoader()
    var id = 126480 //임시 데이터 나중에 받아오는걸로 수정해야댐

    useEffect(() => {
        axios
          .get("http://localhost:3001/schedule/nearPlace",
          {params:{
            id:id,
            distance : distance,//km를 위도 거리로 변환 해야함 
            tag:tag
          }})
          .then(function (response) {
            console.log(response.data)
            if(response.data.length>=maxData){
              alert("데이터가 너무 많습니다. 데이터를 제한해주세요")
              setDatas([])
            }else{
            setDatas(response.data)
            setState({
              center: { lat: response.data[0]?.lat, lng: response.data[0]?.lon }
          })
        }
        })
    }, [distance,tag]);
    useEffect(()=>{
      if(distance<=1)setLevel(4)
      else if(distance<=2)setLevel(5)
      else if(distance<=3)setLevel(6)
      else if(distance<=7)setLevel(7)
      else if(distance<=14)setLevel(8)
      else setLevel(9)
    },[distance])
    console.log(datas)
    const EventMarkerContainer = ({ position, content }) => {
      const map = useMap()
      const [isVisible, setIsVisible] = useState(false)
  
      return (
        <MapMarker
          position={position} // 마커를 표시할 위치
          // @ts-ignore
          onClick={(marker) => map.panTo(marker.getPosition())}
          onMouseOver={() => setIsVisible(true)}
          onMouseOut={() => setIsVisible(false)}
        >
          {isVisible && content}
        </MapMarker>
      )
    }
  return (
    <div className={styles.container}>
      <h1>주변 관광지</h1>
      <div>
        <div>
          거리
        <button className={distance === 1 ? styles.selectedButton : styles.button} onClick={()=>setDistance(1)}>1km</button>
        <button className={distance === 2 ? styles.selectedButton : styles.button} onClick={()=>setDistance(2)}>2km</button>
        <button className={distance === 3 ? styles.selectedButton : styles.button} onClick={()=>setDistance(3)}>3km</button>
        <button className={distance === 4 ? styles.selectedButton : styles.button} onClick={()=>setDistance(4)}>4km</button>
        <button className={distance === 5 ? styles.selectedButton : styles.button} onClick={()=>setDistance(5)}>5km</button>
        <button className={distance === 6 ? styles.selectedButton : styles.button} onClick={()=>setDistance(6)}>6km</button>
        <button className={distance === 7 ? styles.selectedButton : styles.button} onClick={()=>setDistance(7)}>7km</button>
        <button className={distance === 8 ? styles.selectedButton : styles.button} onClick={()=>setDistance(8)}>8km</button>
        <button className={distance === 9 ? styles.selectedButton : styles.button} onClick={()=>setDistance(9)}>9km</button>
        <button className={distance === 10 ? styles.selectedButton : styles.button} onClick={()=>setDistance(10)}>10km</button>
        <button className={distance === 12 ? styles.selectedButton : styles.button} onClick={()=>setDistance(12)}>12km</button>
        <button className={distance === 13 ? styles.selectedButton : styles.button} onClick={()=>setDistance(13)}>13km</button>
        </div>
      </div>
    <div className={styles.main}>
      <Map // 지도를 표시할 Container
        id="map"
        center={state.center}
        className={styles.map}
        style={{
          // 지도의 크기
          width: "1300px",
          height: "800px",
          borderRadius:"20px",
          margin:"15px"
        }}
        level={level} // 지도의 확대 레벨 distance에 따라 다르게 설정해줘야함 
        >
          {datas?.map((data, index) => (
            index===0 || index==mPos?
            <MapMarker
          key = {data.id}
          position={{lat:data.lat,lng:data.lon}} // 마커를 표시할 위치
          title={data.title} // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
          image={{src:selImageSrc,
            size: selImageSize,
            options: {
              spriteSize: selImageSize,
            }
          }}
          onMouseOut={()=>setMPos()}
        />:
        <MapMarker
          key = {data.id}
          position={{lat:data.lat,lng:data.lon}} // 마커를 표시할 위치
          title={data.title}
          image={{src:imageSrc,
            size: imageSize,
            options: {
              spriteSize: spriteSize,
            }
          }} // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
          onMouseOver={()=>setMPos(index)}
        />
      ))}
        {/* {data.map((value) => (
        <EventMarkerContainer
          key={`EventMarkerContainer-${value.latlng.lat}-${value.latlng.lng}`}
          position={value.latlng}
          content={value.content}
        />
      ))} */}
      </Map>
      <div className={styles.list}>
      <div className={styles.tag}>
        태그
        <button className={tag === 1 ? styles.selectedButton : styles.button} onClick={()=>setTag(1)}>전체</button>
        <button className={tag === 2 ? styles.selectedButton : styles.button} onClick={()=>setTag(2)}>음식점</button>
        <button className={tag === 3 ? styles.selectedButton : styles.button} onClick={()=>setTag(3)}>쇼핑</button>
        <button className={tag === 4 ? styles.selectedButton : styles.button} onClick={()=>setTag(4)}>레포츠</button>
        <button className={tag === 5 ? styles.selectedButton : styles.button} onClick={()=>setTag(5)}>관광지</button>
        </div>
        <div className={styles.elements}>
          {datas.map((data) => (
            <div className={styles.element} key={data?.id}>
              <img style={{ width: '150px', height: '80px' }} src={data?.image}/>
              이름 : {data.title}
              거리 : {((((state.center.lat-data.lat)*142.85).toFixed(3)**2 + ((state.center.lng-data.lon)*86.95).toFixed(3)**2)**1/2).toFixed(3)*1000}m
            </div>
          ))}
        </div>
        </div>
    </div>
    </div>
  )
}
export default NearPlace