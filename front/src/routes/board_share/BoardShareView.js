import React, { useEffect, useState } from "react";
import styles from "./BoardShareView.module.css";
import Header from "../../components/Header";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import * as dayjs from "dayjs";
import DatePicker from "react-datepicker";

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
          console.log("받아온 스케쥴 정보 2==>" + response.data);
          setScheduleData(response.data);
        });
    }
    fetchData();
    getUser();
    getBoardPid();
    getScheduleData();
  }, [pid]);

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
