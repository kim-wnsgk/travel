import { Map } from "react-kakao-maps-sdk"
import { useState } from "react"
import styles from "./NearPlace.module.css";
// import useKakaoLoader from "./useKakaoLoader"

function NearPlace() {
//   useKakaoLoader()
    var id = 125409 //임시 데이터 나중에 받아오는걸로 수정해야댐
  return (
    <div>

    <Map // 지도를 표시할 Container
      id="map"
      center={{
        // 지도의 중심좌표
        lat: 33.450701,
        lng: 126.570667,
      }}
      className={styles.map}
      style={{
        // 지도의 크기
        width: "100%",
        height: "350px",
      }}
      level={3} // 지도의 확대 레벨
    />
    </div>
  )
}
export default NearPlace