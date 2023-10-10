import Header from "../../components/Header";
import styles from "./Schedule.module.css";

import { useEffect, useState } from "react";
import Pagination from "react-js-pagination";

import { useNavigate } from "react-router-dom";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as dayjs from "dayjs";
import axios from "axios";

function Schedule() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [items] = useState(5);
  const handlePageChange = (page) => {
    setPage(page);
  };

  const [showModal, setShowModal] = useState(false); // 모달 열림/닫힘 상태를 관리하는 상태 추가
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const [user, setUser] = useState(""); // 테스트용 아이디

  const [schedule, setSchedule] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3001/user/getUser", { withCredentials: true })
      .then(function (response) {
        const session = response.data;
        console.log(session);
        setUser(session.user);
      })
      .catch(function (error) {
        navigate("/");
      });
  }, []);
  useEffect(() => {
    axios
      .get("http://localhost:3001/gathering/select/gathering-userlist", {
        params: {
          user,
        },
      })
      .then(function (response) {
        const data = response.data;
        console.log(data);
        setSchedule(data);
      });
  }, [user]);

  const [name, setName] = useState("");
  const handelName = (e) => {
    const name = e.target.value;
    setName(name);
  };

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  function insert() {
    const oneDay = 24 * 60 * 60 * 1000; // 1일의 밀리초 수
    const diffDays = Math.round(Math.abs((startDate - endDate) / oneDay)) + 1;
    axios
      .get("http://localhost:3001/gathering/insert", {
        params: {
          name,
          user,
          startDate: dayjs(startDate).format("YYYY-MM-DD"),
          date_long: diffDays,
        },
      })
      .then(function (response) {
        console.log(response);
      });
  }

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>
        <div className={styles.mainTitle}>내 일정</div>
        <div className={styles.lists}>
          {schedule &&
            schedule
              .slice(items * (page - 1), items * (page - 1) + items)
              .map((item, index) => {
                console.log(item);
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
                    onClick={() => navigate(`/schedule/info/${item.id}`)}
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
          <div className={styles.addSchedule} onClick={toggleModal}>
            {" "}
            {/* 모달 열기 함수를 호출 */}
            일정 추가
          </div>
          {showModal && (
            <div className={styles.modalBackdrop}>
              <div className={styles.modal}>
                <div className={styles.modalHeader}>
                  <span className={styles.modalTitle}>일정 추가</span>
                  <span className={styles.closeButton} onClick={toggleModal}>
                    &times;
                  </span>
                </div>
                <div className={styles.modalContent}>
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
                  </div>
                </div>
                <div className={styles.modalFooter}>
                  <button
                    className={styles.addButton}
                    onClick={() => {
                      if (name) {
                        insert();
                        toggleModal();
                        setName("");
                        setStartDate(new Date());
                        setEndDate(new Date());
                        alert(`'${name}' 일정이 추가되었습니다.`);
                      } else {
                        alert("일정 제목을 입력해주세요.");
                      }
                    }}
                  >
                    추가
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Schedule;
