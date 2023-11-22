import { Map, useMap, MapMarker,MarkerTrackerStyle,AbstractOverlay } from "react-kakao-maps-sdk"
import { useState, useEffect,useRef,useMemo,useCallback } from "react"
import styles from "./NearPlace.module.css";
import axios from "axios";
import ReactDOM from 'react-dom';
import useDidMountEffect from '../useDidMountEffect';
import { useLocation } from "react-router-dom";
import NearPlaceDetail from './NearPlaceDetail'
import Header from "../../components/Header";
const { kakao } = window;

// import useKakaoLoader from "./useKakaoLoader"

function NearPlace() {
  var selImageSrc = process.env.PUBLIC_URL + '/selMarker.png';
  const location = useLocation().state;
  var imageSrc = process.env.PUBLIC_URL + '/Marker.png';
  const selImageSize = { width: 60, height: 60 }
  const imageSize = { width: 40, height: 40 }
  const spriteSize = { width: 36, height: 40 }
  const maxData = 100;//마커 최대 개수
  const [distance, setDistance] = useState(3);
  const [tag, setTag] = useState(1);
  const [datas, setDatas] = useState([]);
  const [state, setState] = useState({ center: { lat: 33.450701, lng: 126.570667 } });
  const [level, setLevel] = useState(4);
  const [mPos, setMPos] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [selId,setSelId] = useState();
  //tracking
  const TooltipMarker = ({
    position,
    tooltipText,
    title
  }) => {
    const map = useMap()
    // Marker로 올려질 node 객체를 생성 합니다.
    const node = useRef(document.createElement("div"))
    const [visible, setVisible] = useState(false)
    const [tracerPosition, setTracerPosition] = useState({
      x: 0,
      y: 0,
    })
    const [tracerAngle, setTracerAngle] = useState(0)

    const positionLatlng = useMemo(() => {
      return new kakao.maps.LatLng(position.lat, position.lng)
    }, [position.lat, position.lng])

    function onAdd() {
      const panel = this.getPanels()
        .overlayLayer
      panel.appendChild(node.current)
    }

    function onRemove() {
      node.current.parentNode.removeChild(node.current)
    }
    function draw() {
      // 화면 좌표와 지도의 좌표를 매핑시켜주는 projection객체
      const projection = this.getProjection()
      // overlayLayer는 지도와 함께 움직이는 layer이므로
      // 지도 내부의 위치를 반영해주는 pointFromCoords를 사용합니다.
      const point = projection.pointFromCoords(positionLatlng)
      // 내부 엘리먼트의 크기를 얻어서

      const width = node.current.offsetWidth
      const height = node.current.offsetHeight

      // 해당 위치의 정중앙에 위치하도록 top, left를 지정합니다.
      node.current.style.left = point.x - width / 2 + "px"
      node.current.style.top = point.y - height / 2 + "px"
    }

    // 클리핑을 위한 outcode
    const OUTCODE = {
      INSIDE: 0, // 0b0000
      TOP: 8, //0b1000
      RIGHT: 2, // 0b0010
      BOTTOM: 4, // 0b0100
      LEFT: 1, // 0b0001
    }

    const BOUNDS_BUFFER = 30

    const CLIP_BUFFER = 40

    const Marker = ({ tooltipText }) => {
      const [isOver, setIsOver] = useState(false)
      return (
        <div
          className={`node`}
          onMouseOver={() => {
            setIsOver(true)
          }}
          onMouseOut={() => {
            setIsOver(false)
          }}
        >
          {isOver && <div className={`tooltip`}>{tooltipText}</div>}
        </div>
      )
    }

    const Tracker = ({ position, angle }) => {
      return (
        <div
          className={"tracker"}
          style={{
            position: 'absolute',
            zIndex: '100',
            width: '100px',
            height: '100px',
            left: `${position.x}px`,
            top: `${position.y}px`,
            visibility: 'visible', // 추가
            display: 'block',   // 추가
          }}
          onClick={() => {
            map.setCenter(positionLatlng)
            setVisible(false)
          }}
        >
          <div
            className="balloon"
            style={{
              transform: `rotate(${angle}deg)`,
            }}
          ></div>
          <img style={{
            transform: `none`,
          }}className={styles.trackerMarker} src={selImageSrc}></img>
        </div>
      )
    }

    const getClipPosition = useCallback(
      (top, right, bottom, left, inner, outer) => {
        const calcOutcode = (x, y) => {
          let outcode = OUTCODE.INSIDE

          if (x < left) {
            outcode |= OUTCODE.LEFT
          } else if (x > right) {
            outcode |= OUTCODE.RIGHT
          }

          if (y < top) {
            outcode |= OUTCODE.TOP
          } else if (y > bottom) {
            outcode |= OUTCODE.BOTTOM
          }

          return outcode
        }

        let ix = inner.x
        let iy = inner.y
        let ox = outer.x
        let oy = outer.y

        let code = calcOutcode(ox, oy)

        while (true) {
          if (!code) {
            break
          }

          if (code & OUTCODE.TOP) {
            ox = ox + ((ix - ox) / (iy - oy)) * (top - oy)
            oy = top
          } else if (code & OUTCODE.RIGHT) {
            oy = oy + ((iy - oy) / (ix - ox)) * (right - ox)
            ox = right
          } else if (code & OUTCODE.BOTTOM) {
            ox = ox + ((ix - ox) / (iy - oy)) * (bottom - oy)
            oy = bottom
          } else if (code & OUTCODE.LEFT) {
            oy = oy + ((iy - oy) / (ix - ox)) * (left - ox)
            ox = left
          }

          code = calcOutcode(ox, oy)
        }

        return { x: ox, y: oy }
      },
      [OUTCODE.BOTTOM, OUTCODE.INSIDE, OUTCODE.LEFT, OUTCODE.RIGHT, OUTCODE.TOP]
    )

    // 말풍선의 회전각을 구하기 위한 함수
    // 말풍선의 anchor가 TooltipMarker가 있는 방향을 바라보도록 회전시킬 각을 구합니다.
    const getAngle = (center, target) => {
      const dx = target.x - center.x
      const dy = center.y - target.y
      const deg = (Math.atan2(dy, dx) * 180) / Math.PI

      return ((-deg + 360) % 360 | 0) + 90
    }

    // target의 위치를 추적하는 함수
    const tracking = useCallback(() => {
      const proj = map.getProjection()

      // 지도의 영역을 구합니다.
      const bounds = map.getBounds()

      // 지도의 영역을 기준으로 확장된 영역을 구합니다.
      const extBounds = extendBounds(bounds, proj)

      // target이 확장된 영역에 속하는지 판단하고
      if (extBounds.contain(positionLatlng)) {
        // 속하면 tracker를 숨깁니다.
        setVisible(false)
      } else {
        // TooltipMarker의 위치
        const pos = proj.containerPointFromCoords(positionLatlng)

        const center = proj.containerPointFromCoords(map.getCenter())

        // 현재 보이는 지도의 영역의 남서쪽 화면 좌표
        const sw = proj.containerPointFromCoords(bounds.getSouthWest())

        // 현재 보이는 지도의 영역의 북동쪽 화면 좌표
        const ne = proj.containerPointFromCoords(bounds.getNorthEast())

        const top = ne.y + CLIP_BUFFER
        const right = ne.x - CLIP_BUFFER
        const bottom = sw.y - CLIP_BUFFER
        const left = sw.x + CLIP_BUFFER

        const clipPosition = getClipPosition(
          top,
          right,
          bottom,
          left,
          center,
          pos
        )

        setTracerPosition(clipPosition)

        const angle = getAngle(center, pos)
        setTracerAngle(angle)

        setVisible(true)
      }
    }, [getClipPosition, map, positionLatlng])

    const hideTracker = useCallback(() => {
      setVisible(false)
    }, [])

    useEffect(() => {
      node.current.style.position = "absolute"
      node.current.style.whiteSpace = "nowrap"
    }, [])
    const extendBounds = (bounds, proj) => {
      const sw = proj.pointFromCoords(bounds.getSouthWest())
      const ne = proj.pointFromCoords(bounds.getNorthEast())

      sw.x -= BOUNDS_BUFFER
      sw.y += BOUNDS_BUFFER

      ne.x += BOUNDS_BUFFER
      ne.y -= BOUNDS_BUFFER

      return new kakao.maps.LatLngBounds(
        proj.coordsFromPoint(sw),
        proj.coordsFromPoint(ne)
      )
    }

    useEffect(() => {
      kakao.maps.event.addListener(map, "zoom_start", hideTracker)
      kakao.maps.event.addListener(map, "zoom_changed", tracking)
      kakao.maps.event.addListener(map, "center_changed", tracking)
      tracking()

      return () => {
        kakao.maps.event.removeListener(map, "zoom_start", hideTracker)
        kakao.maps.event.removeListener(map, "zoom_changed", tracking)
        kakao.maps.event.removeListener(map, "center_changed", tracking)
        setVisible(false)
      }
    }, [map, hideTracker, tracking])

    console.log("selId,mPos:",selId,mPos)
    return (
      <>
        <AbstractOverlay onAdd={onAdd} onRemove={onRemove} draw={draw} />
        {visible
          ? ReactDOM.createPortal(
              <Tracker position={tracerPosition} angle={tracerAngle} />,
              // @ts-ignore
              map.getNode()
            )
          : ReactDOM.createPortal(
              <MapMarker tooltipText={tooltipText} 
              position={position}
              zIndex={2}
              image={{
                src: selImageSrc,
                size: selImageSize,
                options: {
                  spriteSize: selImageSize,
                },
              }}
              onClick={()=>{setIsOpen(true)}}
              onMouseOver={() =>{setSelId(location.id);setMPos(0)}}
              onMouseOut={() => setMPos()}
              >
                <div style={{zIndex:500, padding: "5px", color: "#000", width:"150px",textAlign:'center' }}>{title}</div>
              </MapMarker>,
              node.current
            )}
      </>
    )
  }
  //   useKakaoLoader()
  var id = location.id //임시 데이터 나중에 받아오는걸로 수정해야댐

  useEffect(() => {
    axios
      .get("/schedule/nearPlace",
        {
          params: {
            id: id,
            distance: distance,//km를 위도 거리로 변환 해야함 
            tag: tag
          }
        })
      .then(function (response) {
        if (response.data.length >= maxData) {
          alert("죄송합니다, 데이터 양이 너무 많아서 모두 표시할 수 없습니다. 데이터를 제한하여 더 적은 결과를 볼 수 있도록 해주세요.")
          
        } else if (response.data.length == 1) {
          alert("죄송합니다, 현재 지정된 범위 내에서는 데이터를 찾을 수 없습니다. 검색 범위를 조정하거나 다른 위치를 시도해 주세요.")
          
        }
        else {
          setDatas(response.data)
          setState({
            center: { lat: response.data[0]?.lat, lng: response.data[0]?.lon }
          })
        }
      })
  }, [distance, tag]);
  useEffect(() => {
    if (distance <= 1) setLevel(4)
    else if (distance <= 2) setLevel(5)
    else if (distance <= 3) setLevel(6)
    else if (distance <= 7) setLevel(7)
    else if (distance <= 14) setLevel(8)
    else setLevel(9)
  }, [distance])

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
      <Header />
      <h1>주변 관광지</h1>
      <div>
        <div>
          거리&nbsp;
          <button className={distance === 1 ? styles.selectedButton : styles.button} onClick={() => setDistance(1)}>1km</button>
          <button className={distance === 3 ? styles.selectedButton : styles.button} onClick={() => setDistance(3)}>3km</button>
          <button className={distance === 5 ? styles.selectedButton : styles.button} onClick={() => setDistance(5)}>5km</button>
          <button className={distance === 7 ? styles.selectedButton : styles.button} onClick={() => setDistance(7)}>7km</button>
          <button className={distance === 10 ? styles.selectedButton : styles.button} onClick={() => setDistance(10)}>10km</button>
        </div>
      </div>
      <div className={styles.main}>
      {/* <MarkerTrackerStyle /> */}
        <Map // 지도를 표시할 Container
          id="map"
          center={state.center}
          className={styles.map}
          style={{
            // 지도의 크기
            width: "1300px",
            height: "800px",
            borderRadius: "20px",
            margin: "15px"
          }}
          level={level} // 지도의 확대 레벨 distance에 따라 다르게 설정해줘야함 
        >
          {datas?.map((data, index) => (
            index === 0?
              <TooltipMarker
                position={{ lat: data.lat, lng: data.lon }}
                key={data.id}
                title={data.title}
                tooltipText={data.title}
                // onClick={()=>{setIsOpen(true)}}
                // onMouseOver={() =>{setSelId(data.contentId);setMPos(index)}}
                // onMouseOut={() => setMPos()}
              ></TooltipMarker> : index == mPos ?
              <MapMarker
                zIndex={2}
                key={data.id}
                position={{ lat: data.lat, lng: data.lon }}
                title={data.title}
                image={{
                  src: selImageSrc,
                  size: selImageSize,
                  options: {
                    spriteSize: selImageSize,
                  },
                }}
                onClick={()=>{setIsOpen(true)}}
                onMouseOver={() =>{setSelId(data.contentId);setMPos(index)}}
                onMouseOut={() => setMPos()}
              > <div style={{zIndex:500, padding: "5px", color: "#000", width:"150px",textAlign:'center' }}>{data.title}</div></MapMarker> :
              <MapMarker
                zIndex={1}
                key={data.id}
                position={{ lat: data.lat, lng: data.lon }} // 마커를 표시할 위치
                title={data.title}
                image={{
                  src: imageSrc,
                  size: imageSize,
                  options: {
                    spriteSize: spriteSize,
                  }
                }} // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
                onMouseOver={() =>{setSelId(data.contentId);setMPos(index)}}
                
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
            태그&nbsp;&nbsp;
            <button className={tag === 1 ? styles.selectedButton : styles.button} onClick={() => setTag(1)}>전체</button>
            <button className={tag === 39 ? styles.selectedButton : styles.button} onClick={() => setTag(39)}>음식점</button>
            <button className={tag === 38 ? styles.selectedButton : styles.button} onClick={() => setTag(38)}>쇼핑</button>
            <button className={tag === 28 ? styles.selectedButton : styles.button} onClick={() => setTag(28)}>레포츠</button>
            <button className={tag === 12 ? styles.selectedButton : styles.button} onClick={() => setTag(12)}>문화,관광지</button>
          </div>
          <div className={styles.elements}>
            {datas.map((data,index) => (
              index ==0 ? <div/>:
              <div onMouseEnter={()=>{setSelId(data.contentId);setMPos(index)}}
              onMouseLeave={()=>setMPos()} 
              onClick={()=>{setIsOpen(true)}}
              className={styles.element} key={data?.id}>
                <img style={{ width: '150px', height: '80px' }} src={data.image ? data.image : process.env.PUBLIC_URL+'./defaultImage.png'} />
                이름 : {data.title}
                
                &nbsp;&nbsp;&nbsp;거리 : {((((state.center.lat - data.lat) * 142.85) ** 2 + ((state.center.lng - data.lon) * 86.95) ** 2) ** 1 / 2).toFixed(3) * 1000}m
              </div>
            ))}
          </div>
        </div>
      </div>
      {isOpen&& <NearPlaceDetail setModalOpen={setIsOpen} id={selId}/>}
     
    </div>
  )
}
export default NearPlace