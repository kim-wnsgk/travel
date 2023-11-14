import React from "react";
import styles from "./BoardShareWrite.module.css";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import EditorComponent from "./quill/EditorComponent";
import UploadFiles from "./fileupload/UploadFiles";
import Pagination from "react-js-pagination";
import * as dayjs from "dayjs";

function BoardSharedWrite() {
  const navigate = useNavigate();
  const uploadReferenece = React.createRef();

  //id가 일치하는 세부일정
  const [item, setItem] = useState();

  const date = "22-05-05"; //테스트용 데이트
  //session에서 유저 정보 받아오기
  const [user, setUser] = useState();
  const [isLogin, setIsLogin] = useState();

  async function onClickSearch() {
    await uploadReferenece.current
      .upload()
      .then(function (result) {
        const files = result;
        alert("저장 완료");
      })
      .catch(function (err) {});
  }

  const [title, setTitle] = useState("");
  const handelTitle = (e) => {
    const titleText = e.target.value;
    console.log(titleText);
    setTitle(titleText);
  };
  const [desc, setDesc] = useState("");
  function onEditorChange(value) {
    setDesc(value);
    console.log(desc);
  }
  //modal 관련
  const [showModal, setShowModal] = useState(false); // 모달 열림/닫힘 상태를 관리하는 상태 추가

  const [schedule, setSchedule] = useState([]);

  const [items] = useState(5);
  const [page, setPage] = useState(1);
  const handlePageChange = (page) => {
    setPage(page);
  };

  const [dataDetail, setDataDetail] = useState({});

  function onClickShare() {
    setDesc(" ");

    console.log("아이템 변수" + JSON.stringify(item));

    fetch("/board/BoardShareWrite3", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    })
      .then((response) => response.json())
      .then((data) => {
        //console.log("받아온 데이터 => " + JSON.stringify(data)); // 결과 처리
        setDataDetail(data);
        console.log("받아온 dataDetail=>" + JSON.stringify(dataDetail));
      })
      .catch((error) => console.error("서버 요청 오류:", error));

    setDesc((prev) => prev + "일정에 대해 설명해주세요!");
  }
  //중복없는 문자열 생성기///////////////////
  function generateRandomString(length) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
  }
  //////////////////////////////

  useEffect(() => {
    async function getUser() {
      try {
        const testData = axios
          .get("/user/getUser", {
            withCredentials: true,
          })
          .then(function (response) {
            const session = response.data;
            console.log(session.isLogin + "1");
            setUser(session.user);
            setIsLogin(session.isLogin);
          });
      } catch (error) {
        console.log("Error fetching profile:", error);
      }
    }
    async function getGateringUserList() {
      try {
        const listData = axios
          .get("/gathering/select/gathering-userlist", {
            params: {
              user,
            },
          })
          .then(function (response) {
            const data = response.data;
            console.log(data);
            setSchedule(data);
          });
      } catch (error) {
        console.log(error);
      }
    }
    getUser();
    getGateringUserList();
  }, [user]);
  const [randId, setRandId] = useState();

  return (
    <div className={styles.mainPageContainer}>
      <Header />
      <div className={styles.contentContainer}>
        <div className={styles.boardTitle}>
          제목
          <div className={styles.boaderTitleWrite}>
            <textarea
              className={styles.boardTitleTextArea}
              placeholder="제목을 입력하세요"
              value={title}
              onChange={handelTitle}
            >
              {title}
            </textarea>
          </div>
          <div className={styles.boardShareArea}>
            <div>일정을 선택해서 공유해주세요!</div>
            {schedule &&
              schedule
                .slice(items * (page - 1), items * (page - 1) + items)
                .map((item, index) => {
                  //console.log(item);
                  const startDate = dayjs(item.start);
                  const currentDate = dayjs();
                  const dday = Math.round(startDate.diff(currentDate, "day"));
                  const ddayString =
                    dday === 0
                      ? "D-Day"
                      : dday < 0
                      ? `D+${Math.abs(dday)}`
                      : `D-${dday}`;

                  const ddayColor =
                    dday === 0 ? "red" : dday < 0 ? "blue" : "black"; // 색상 조건에 따라 변경
                  const ddayStyle = {
                    color: ddayColor,
                  };

                  return (
                    <div
                      className={styles.list}
                      key={index}
                      onClick={() => {
                        console.log("클릭됨!");
                        setItem(item);
                        setTimeout(onClickShare, 300);
                        // console.log("item 값 => " + JSON.stringify(item));
                        //onClickShare();
                      }}
                    >
                      <div className={styles.title}>{item.name}</div>
                      <div className={styles.date}>
                        {dayjs(item.start).format("YYYY-MM-DD. ddd")} ~{" "}
                        {dayjs(item.start)
                          .add(item.date - 1, "day")
                          .format("YYYY-MM-DD. ddd")}
                      </div>
                      <div className={styles.dday} style={ddayStyle}>
                        {ddayString}
                      </div>
                    </div>
                  );
                })}
            <div className={styles.PaginationBox}>
              <Pagination
                className={styles.Pagination}
                activePage={page}
                itemsCountPerPage={items}
                totalItemsCount={schedule.length}
                pageRangeDisplayed={5}
                onChange={handlePageChange}
                prevPageText={"<"}
                nextPageText={">"}
              ></Pagination>
            </div>
          </div>
          <div className={styles.boardFileUpload}>
            {/*파일 올리고 내리고...*/}
            <UploadFiles ref={uploadReferenece} />
          </div>
        </div>
        <div className={styles.boardContent}>
          <div>
            <EditorComponent
              value={desc}
              onChange={onEditorChange}
            ></EditorComponent>
          </div>
        </div>
        <div className="text-center pd12">
          {!isLogin ? (
            <button
              className="lf-button primary"
              onClick={() => {
                const board_id = new Date().getTime() + Math.random();
                const boardData = {
                  writer: user,
                  title: title,
                  content: desc,
                  regdate: date,
                  updatedate: null,
                  viewcount: null,
                  image: null,
                  pid: board_id,
                };
                fetch("/board/BoardShareWrite", {
                  method: "post",
                  headers: {
                    "content-type": "application/json",
                  },
                  body: JSON.stringify(boardData),
                })
                  .then((res) => res.json())
                  .then((json) => {
                    console.log(json.isSuccess);
                    if (json.isSuccess === "True") {
                      alert("게시물 작성 성공1");
                      navigate(-1);
                    } else {
                      alert(json.isSuccess);
                    }
                  });
                for (var i = 0; i < dataDetail.length; i++) {
                  dataDetail[i].board_id = board_id;
                }
                fetch("/board/BoardShareWrite2", {
                  method: "post",
                  headers: {
                    "content-type": "application/json",
                  },
                  body: JSON.stringify(dataDetail),
                })
                  .then((res) => res.json())
                  .then((json) => {
                    console.log(json.isSuccess);
                    if (json.isSuccess === "True") {
                      alert("게시물 작성 성공2");
                      navigate(-1);
                    } else {
                      alert(json.isSuccess);
                    }
                  });

                // for (var i = 0; i < dataDetail.length; i++) {
                //   console.log("반복중");
                //   //const id = schedule[i].id;
                //   console.log("확인용" + dataDetail);
                //   const sight_id = dataDetail[i].sight_id;
                //   const start = dataDetail[i].start;
                //   const end = dataDetail[i].end;
                //   const offset = dataDetail[i].offset;
                //   const date = dataDetail[i].date;
                //   console.log("offset잘 뜨나 확인 => " + offset);
                //   const boardData = {
                //     board_id: board_id,
                //     sight_id: sight_id,
                //     start: start,
                //     end: end,
                //     offset: offset,
                //     date: date,
                //   };

                console.log(boardData);
                navigate(-1);
              }}
              //}
            >
              저장
            </button>
          ) : (
            <div>로그인 후 글을 작성해보세요.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BoardSharedWrite;
