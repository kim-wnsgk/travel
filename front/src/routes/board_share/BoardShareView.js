import React, { useEffect, useState } from "react";
import styles from "./BoardShareView.module.css";
import Header from "../../components/Header";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import * as dayjs from "dayjs";
import DatePicker from "react-datepicker";
import MapDetail from "../schedule/MapDetail";
import useDidMountEffect from "../useDidMountEffect";
import { Link } from "react-router-dom";
import Map from "../schedule/MapSchCom";

const BoardShareView = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const board_id = location.state.boardData.board_id;
  //console.log(board_id);
  // 이거 기반으로 pid 가져와서
  // 여행 일정 변수로 받아와서
  // 공유받기 누르면 그 작성자 일정에 추가하는 것.
  // 구현하기 ㅋㅋ
  const board_data = location.state.boardData;
  const writer = "sls9905";
  const [commentData, setCommentData] = useState([]);
  const [user, setUser] = useState();
  const [isLogin, setIsLogin] = useState();
  const [pid, setPid] = useState();
  const [scheduleData, setScheduleData] = useState();
  const [toggleClick, setToggleClick] = useState(false);
  const [scheduleInfoData, setScheduleInfoData] = useState({});
  const [scheduleData2, setScheduleData2] = useState();
  useEffect(() => {
    async function fetchData() {
      axios
        .get("http://localhost:3001/board/boardView_share_Comment2", {
          params: {
            id: board_id,
          },
        })
        .then(function (response) {
          setCommentData(response.data);
        });
    }
    async function getUser() {
      try {
        const testData = axios
          .get("http://localhost:3001/user/getUser", {
            withCredentials: true,
          })
          .then(function (response) {
            const session = response.data;
            //console.log(session.isLogin);
            setUser(session.user);
            setIsLogin(session.isLogin);
          });
      } catch (error) {
        console.log("Error fetching profile:", error);
      }
    }
    async function getBoardPid() {
      axios
        .get("http://localhost:3001/board/getBoardPid", {
          params: {
            id: board_id,
          },
        })
        .then(function (response) {
          setPid(response.data[0].pid);
          console.log("게시글 pid => " + pid);
        });
    }
    async function getScheduleData() {
      axios
        .get("http://localhost:3001/board/getBoardScheduleData", {
          params: {
            pid: pid,
          },
        })
        .then(function (response) {
          console.log(
            "받아온 스케쥴 정보 1==>" + JSON.stringify(response.data)
          );
          setScheduleData(response.data);
          setScheduleData2(response.data[0]);
        });
    }

    fetchData();
    getUser();
    getBoardPid();
    getScheduleData();
  }, [pid]);

  useDidMountEffect(() => {
    async function getScheduleInfoData() {
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
      console.log(JSON.stringify(scheduleData));
      axios
        .get("http://localhost:3001/schedule/checkDate", {
          params: {
            id: scheduleData[0].bid,
          },
        })
        .then(function (response) {
          setScheduleInfoData(response.data);
          console.log("@scheduleInfoData@" + JSON.stringify(response.data));
        });
    }
    getScheduleInfoData();
  }, [scheduleData]);

  const [comment, setComment] = useState("");

  const handleComment = (e) => {
    setComment(e.target.value);
  };
  const submitComment = () => {
    const commentData = {
      comment: comment,
      writer: user,
      id: board_id,
    };
    //댓글쓰는거 문제가있음.. ㅠㅠ
    //console.log(commentData);
    //comment의 내용을 db로 전송 -> 내용을 댓글 리스트에 표현.
    fetch("http://localhost:3001/board/BoardWrite_share_Comment", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(commentData),
    });

    setComment("");
    window.location.reload();
  };

  const getScheduleToggle = () => {
    if (toggleClick) {
      setToggleClick(false);
    } else {
      setToggleClick(true);
    }
    console.log("클릭 발생 =>" + JSON.stringify(scheduleData));
  };

  const [name, setName] = useState("");
  const handelName = (e) => {
    setName(e.target.value);
  };
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [style, setStyle] = useState("");
  const handelStyle = (e) => {
    setStyle(e.target.value);
  };
  // const [data, setData] = useState();
  const [id, setId] = useState();
  //const [schedule_id, setSchedule_id] = useState();

  function insert() {
    //여기 구간은 큰 일정 틀(모임생성)을 저장하는 것.
    const oneDay = 24 * 60 * 60 * 1000; // 1일의 밀리초 수
    const diffDays = Math.round(Math.abs((startDate - endDate) / oneDay)) + 1;
    var idData = 0;
    axios
      .get("http://localhost:3001/gathering/insert", {
        params: {
          name,
          user,
          style,
          startDate: dayjs(startDate).format("YYYY-MM-DD"),
          date_long: diffDays,
        },
      })
      .then(function (response) {
        idData = parseInt(response.data.insertId);
        console.log("받아온 ai id값 => " + JSON.parse(response.data.insertId));
        axios
          .get("http://localhost:3001/schedule/addSch2", {
            params: {
              id: idData,
              data: scheduleData,
            },
          })
          // .then((response) => {
          //   console.log("서버 응답:", response.data);
          // })
          .catch((error) => {
            console.error("에러:", error);
          });
      }); // 이러면 방금 그 id값 받아온것. 받아온 id값으로 세부 일정 넣어주기.
    navigate("/schedule");
  }

  return (
    <div className={styles.mainPageContainer}>
      <Header />
      <div className={styles.contentContainer}>
        <div className={styles.title}>{board_data.title}</div>
        <div className={styles.date}>
          {dayjs(board_data.regdate).format("YYYY/MM/DD")}
        </div>
        <div className={styles.viewAndWriter}>
          <div>102 Views</div>
          <div className={styles.bar}> </div>
          <div className={styles.writer}>{board_data.writer}</div>
        </div>
        <div className={styles.contentBox}>
          <div className="test">
            <div className={styles.map}>
              <Map
                id={scheduleData2?.bid}
                offset={0}
                date={scheduleInfoData[0]?.date}
                name={""}
                style={{ width: "50%" }}
              />
            </div>
          </div>
          <div>{board_data.content}</div>
          {!isLogin ? (
            <div className={styles.getScheduleBox}>
              <button
                style={{ float: "left" }}
                className={styles.uploadButton}
                onClick={getScheduleToggle}
              >
                일정 받아오기
              </button>
            </div>
          ) : null}
          {toggleClick ? (
            <div>
              <div
                className={styles.modalContent}
                style={{ marginTop: "30px" }}
              >
                <div className={styles.name}>
                  일정 제목
                  <input
                    className={styles.boardTitleTextArea}
                    placeholder="일정 제목을 입력하세요"
                    onChange={handelName}
                    value={name}
                  />
                </div>
                <div className={styles.date}>
                  <div className={styles.startDate}>
                    <span
                      style={{
                        marginRight: 10,
                        whiteSpace: "nowrap",
                      }}
                    >
                      여행 시작일 선택
                    </span>
                    <DatePicker
                      showIcon
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      selectsStart
                      dateFormat={"yyyy년 MM월 dd일"}
                      minDate={new Date()}
                    ></DatePicker>
                  </div>
                  <div className={styles.boardStartParty}>
                    <span
                      style={{
                        marginRight: 10,
                        whiteSpace: "nowrap",
                      }}
                    >
                      여행 종료일 선택
                    </span>
                    <DatePicker
                      showIcon
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      selectsStart
                      dateFormat={"yyyy년 MM월 dd일"}
                      minDate={new Date()}
                    ></DatePicker>
                  </div>
                  <div className={styles.name}>
                    여행 스타일
                    <input
                      className={styles.boardTitleTextArea}
                      placeholder="여행의 스타일을 입력해주세요.(ex. 액티비티)"
                      onChange={handelStyle}
                      value={style}
                    />
                  </div>
                  <button className={styles.uploadButton} onClick={insert}>
                    저장하기
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <div className={styles.comment}>
          <div className={styles.commentBox}>
            <div className={styles.profileArea}>
              {!isLogin ? user : "로그인 후 댓글을 작성해보세요."}
            </div>
            <div className={styles.writeArea}>
              <div className={styles.wirteAreaInner}>
                {!isLogin ? (
                  <textarea
                    className={styles.commentTextArea}
                    placeholder="다양한 의견이 서로 존중될 수 있도록 다른사람에게 불쾌감을 주는 욕설, 혐오, 비하의 표현이나 타인의 권리를 침해하는 내용은 주의해주세요. 모든 작성자는 본인이 작성한 의견에 대해 법적 책임을 갖는다는 점 유의하시기 바랍니다."
                    onChange={handleComment}
                  >
                    {/*추가로 로그인 되어있지 않다면 댓글 작성창 안보이게 하고 댓글작성은 로그인이 필요합니다. 문구 띄우기 */}
                  </textarea>
                ) : null}
              </div>
            </div>
            <div className={styles.uploadBox}>
              {!isLogin ? (
                <button className={styles.uploadButton} onClick={submitComment}>
                  등록
                </button>
              ) : null}
            </div>
          </div>
          <div className={styles.commentList}>댓글 리스트</div>
          <div>
            {commentData.map((p) => (
              <div className={styles.commentBox}>
                <div className={styles.commentWriter}>{p.writer}</div>
                <div className={styles.commentRegdate}>
                  {dayjs(p.create_date).format("YYYY/MM/DD")}
                </div>
                <div className={styles.commentContent}>{p.comment}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardShareView;

{
  /* <div className="지도관련 테스트 컨테이너">
        <div className={styles.container}>
          {isOpen && (
            <MapDetail
              setModalOpen={setIsOpen}
              title={addr[curAddr]?.title}
              image={addr[curAddr]?.image}
              contentId={addr[curAddr]?.contentId}
            />
          )}
          <div className={styles.headEles}>
            <h1>{location.name} 모임</h1>
            <div className={styles.dates}>
              {Array.from({ length: location.date }, (_, index) =>
                index === selected ? (
                  <button
                    className={styles.selButtons}
                    onClick={() => select(index)}
                  >
                    {index + 1}일차
                  </button>
                ) : (
                  <button
                    className={styles.selButton}
                    onClick={() => select(index)}
                  >
                    {index + 1}일차
                  </button>
                )
              )}
            </div>
          </div>
          <div className={styles.mainEles}>
            <div className={styles.map} id="map" />
            <div className={styles.list}>
              {schs.length === 0 ? (
                <div>
                  <p>아직 일정이 없습니다. 추가해주세요.</p>
                  <Link to="../recommand">여행지 추가하러 가기</Link>
                </div>
              ) : (
                schs.map((item, index) =>
                  index === curVal ? (
                    <div className={styles.eles}>
                      {index + 1}.
                      <div className={styles.schduleSite}>
                        장소 : {item.sight_id}
                      </div>
                      <div className={styles.schduleTime}>
                        일정 시간 : {item.start} ~ {item.end}
                      </div>
                    </div>
                  ) : (
                    <div
                      className={styles.ele}
                      onMouseEnter={() => {
                        handleMouseOver(index);
                      }}
                      onMouseLeave={() => handleMouseOut(index)}
                    >
                      {index + 1}.
                      <div className={styles.schduleSite}>
                        장소 : {item.sight_id}
                      </div>
                      <div className={styles.schduleTime}>
                        일정 시간 : {item.start} ~ {item.end}
                      </div>
                    </div>
                  )
                )
              )}
            </div>
          </div>
        </div>
      </div> */
}

// //---------------지도 관련----------- //
// let markers = [];
// const { kakao } = window;
// const infowindows = [];
// const map = {};
// const NAVER = process.env.REACT_APP_NAVER_MAP;
// const NAVER_ID = process.env.REACT_APP_NAVER_MAP_ID;
// const [schs, setSchs] = useState([]);
// const [selected, setSelected] = useState(scheduleData.offset);
// const [addr, setAddr] = useState([]);
// const [curVal, setCurVal] = useState();
// const [isHovered, setIsHovered] = useState(false);
// const [isOpen, setIsOpen] = useState(false);
// const [curAddr, setCurAddr] = useState();
// var selImageSrc = process.env.PUBLIC_URL + "/selMarker.png";
// var selImageSize = new kakao.maps.Size(64, 69);
// var selImageOption = { offset: new kakao.maps.Point(34, 69) };
// var selMarkerImage = new kakao.maps.MarkerImage(
//   selImageSrc,
//   selImageSize,
//   selImageOption
// );
// var imageSrc = process.env.PUBLIC_URL + "/marker.png";
// var imageSize = new kakao.maps.Size(40, 42);
// var imageOption = { offset: new kakao.maps.Point(22, 42) };
// var markerImage = new kakao.maps.MarkerImage(
//   imageSrc,
//   imageSize,
//   imageOption
// );
// //두 마커 사이의 거리 구하기
// const dist = [];

// function select(index) {
//   setSelected(index);
//   markers = [];
// }
// async function fetchSch() {
//   if (id) {
//     await axios
//       .get("http://localhost:3001/schedule/getSchedule", {
//         params: {
//           id: scheduleData.id,
//           offset: selected,
//         },
//       })
//       .then(function (response) {
//         setSchs(response.data);
//       });
//   }
// }

// async function getDirection(origin, destination) {
//   try {
//     const response = await axios.get(
//       "http://localhost:3001/schedule/getDirection",
//       {
//         params: {
//           origin: origin,
//           destination: destination,
//         },
//       }
//     );
//     return [response.data.distance, response.data.duration];
//   } catch (error) {
//     console.error(error);
//     return [null, null];
//   }
// }

// async function convertAddr() {
//   await axios
//     .get("http://localhost:3001/schedule/convertAddr", {
//       params: {
//         id: id,
//         offset: selected,
//       },
//     })
//     .then(function (response) {
//       setAddr(response.data);
//     });
// }
// useDidMountEffect(() => {
//   if (schs) {
//     convertAddr();
//   } else {
//     console.log("none");
//   }
// }, [schs]);
// useEffect(() => {
//   fetchSch();
// }, [selected]);
// useDidMountEffect(() => {
//   markers = [];
//   async function map() {
//     const container = document.getElementById("map");
//     const options = {
//       center: new kakao.maps.LatLng(37.3226546, 127.1260339), //지도의중심좌표
//       level: 2,
//       zIndex: 1,
//     };
//     map = new kakao.maps.Map(container, options);
//     var Addr = [];
//     if (Object.keys(addr).length === 0) {
//       console.log("none");
//       var iwContent =
//           '<div style="margin:auto;margin-top:20px;text-align:center;height:150px;width:450px;font-size:45px;color:red;padding:5px;"> 아직 일정이 없습니다. <br/>일정을 추가해주세요!</div>',
//         iwPosition = new kakao.maps.LatLng(37.3226546, 127.1260339), //인포윈도우 표시 위치입니다
//         iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

//       // // 인포윈도우를 생성하고 지도에 표시합니다
//       var infowindow = new kakao.maps.InfoWindow({
//         map: map, // 인포윈도우가 표시될 지도
//         position: iwPosition,
//         content: iwContent,
//         removable: iwRemoveable,
//       });
//     } else {
//       for (var i = 0; i < addr.length; i++) {
//         Addr[i] = addr[i].addr;
//       }
//       // Addr[i] = addr[i].addr
//       var points = [];
//       var geocoder = new kakao.maps.services.Geocoder();
//       Promise.all(
//         Addr.map(
//           (address) =>
//             new Promise((resolve) => {
//               geocoder.addressSearch(address, function (result, status) {
//                 if (status === kakao.maps.services.Status.OK) {
//                   resolve(new kakao.maps.LatLng(result[0].y, result[0].x));
//                 } else {
//                   resolve(null); // 에러 발생 시 null로 처리 또는 에러 처리
//                 }
//               });
//             })
//         )
//       ).then((points) => {
//         var bounds = new kakao.maps.LatLngBounds();

//         points.forEach((point, index) => {
//           if (point) {
//             if (index != 0) {
//               dist.push(
//                 getDirection(
//                   `${points[index - 1].La},${points[index - 1].Ma}`,
//                   `${points[index].La},${points[index].Ma}`
//                 )
//               );
//             }
//             var marker = new kakao.maps.Marker({
//               position: point,
//               clickable: true,
//               image: markerImage,
//             });

//             marker.setMap(map);
//             bounds.extend(point);
//             var infowindow = new kakao.maps.InfoWindow({
//               content: `<div style="width:200px;height:40px;overflow:hidden;margin:auto;background-color:none;">시간:${schs[index].start}~${schs[index].end}<br/> 장소:${schs[index].sight_id}</div>`,
//             });
//             infowindows.push(infowindow);
//             kakao.maps.event.addListener(
//               marker,
//               "mouseover",
//               makeOverListener(map, marker, infowindow, index)
//             );
//             kakao.maps.event.addListener(
//               marker,
//               "mouseout",
//               makeOutListener(infowindow, index)
//             );
//             kakao.maps.event.addListener(
//               marker,
//               "click",
//               markerClicked(index)
//             );
//             markers.push(marker);
//           }
//         });
//         map.setBounds(bounds);

//         var polyline = new kakao.maps.Polyline({
//           path: points, // 선을 구성하는 좌표배열 입니다
//           strokeWeight: 5, // 선의 두께 입니다
//           strokeColor: "#ff0000", // 선의 색깔입니다s
//           strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
//           strokeStyle: "solid", // 선의 스타일입니다
//         });
//         Promise.all(dist).then((results) => {
//           // 지도에 선을 표시합니다
//           polyline.setMap(map);
//           points.forEach((point, index) => {
//             if (point) {
//               if (index != 0) {
//                 var customOvAd = new kakao.maps.LatLng(
//                   (points[index].Ma + points[index - 1].Ma) / 2,
//                   (points[index].La + points[index - 1].La) / 2
//                 );
//                 var customOv = `<div style="margin:auto;background-color:white;border:1px solid black"><span class="left"></span><span class="center">시간 : ${Math.ceil(
//                   results[index - 1][0] / 1000
//                 )}km<br>이동거리 : ${
//                   Math.ceil(results[index - 1][1] / 360000) / 10
//                 }시간</span><span class="right"></span></div>`;
//                 var customOverlay = new kakao.maps.CustomOverlay({
//                   position: customOvAd,
//                   content: customOv,
//                 });
//                 customOverlay.setMap(map);
//               }
//             }
//           });
//         });
//       });
//     }
//   }
//   map();
// }, [addr]);
// //마우스 오버시
// function makeOverListener(map, marker, infowindow, index) {
//   return function () {
//     infowindow.open(map, marker);
//     try {
//       markers[index].setImage(selMarkerImage);
//       setCurVal(index);
//     } catch (error) {
//       console.error("이미지 아직 로드 안됨");
//     }
//   };
// }

// //마우스가 마커를 벗어나면
// function makeOutListener(infowindow, index) {
//   return function () {
//     infowindow.close();
//     markers[index].setImage(markerImage);
//     setCurVal(-1);
//   };
// }
// //마커 클릭하면
// function markerClicked(index) {
//   return function () {
//     for (var j = 0; j < addr.length; j++) {
//       if (schs[index].sight_id == addr[j].title) {
//         setCurAddr(j);
//       }
//     }
//     setIsOpen(true);
//   };
// }
// function handleMouseOver(index) {
//   if (selMarkerImage) {
//     markers[index]?.setImage(selMarkerImage);
//   }
// }
// function handleMouseOut(index) {
//   if (markerImage) {
//     markers[index]?.setImage(markerImage);
//   }
// }
//--------------지도 관련 끝-------------------//
