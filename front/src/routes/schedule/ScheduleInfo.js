import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";
import styles from "./ScheduleInfo.module.css";
import Map from "./MapSchCom";

function ScheduleInfo() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [schedule, setSchedule] = useState({}); // 초기 상태를 빈 객체로 설정
  const [user, setUser] = useState("");

  const [members, setMembers] = useState({});
  const [memberIdText, setMemberIdText] = useState("");

  const [dateText, setDateText] = useState("");

  useEffect(() => {
    axios
      .get(
        `/gathering/select/gathering-scheduleinfo-id?id=${id}`
      ) // URL에 id 추가
      .then(function (response) {
        const { data } = response;
        console.log(data[0]);
        setSchedule(data[0]); // 데이터를 상태에 설정
      });
  }, [id]);
  useEffect(() => {
    axios
      .get(`/user/getUser`, { withCredentials: true })
      .then(function (response) {
        const { data } = response;
        // console.log(data);
        setUser(data.user); // 데이터를 상태에 설정
      });
  }, [user]);

  const [isModalOpen1, setModalOpen1] = useState(false);
  const [isModalOpen2, setModalOpen2] = useState(false);

  const toggleModal1 = () => {
    setModalOpen1(!isModalOpen1);
  };
  const toggleModal2 = () => {
    setModalOpen2(!isModalOpen2);
  };

  const delOneDay = () => {
    axios
      .get("/schedule/delOneDay", {
        params: {
          offset: Number(dateText) - 1,
          id,
        },
      })
      .then(function (response) {
        alert(`${Number(dateText)}일차가 삭제되었습니다.`);
        window.location.reload();
      });
  };

  const addOneDay = () => {
    axios
      .get("/schedule/addOneDay", {
        params: {
          offset: Number(dateText) - 1,
          id,
        },
      })
      .then(function (response) {
        alert(`${Number(dateText)}일차가 추가되었습니다.`);
        window.location.reload();
      });
  };

  const deleteSchedule = () => {
    axios
      .get("/gathering/delete", {
        params: {
          id: schedule.id,
        },
      })
      .then(function (response) {
        alert(`${schedule.name} 일정이 삭제되었습니다.`);
        navigate("/schedule");
      });
  };
  // 멤버 리스트 가져오기
  useEffect(() => {
    axios
      .get(`/gathering/select/members`, {
        params: {
          id,
        },
      }) // URL에 id 추가
      .then(function (response) {
        const { data } = response;
        console.log(data);
        setMembers(data); // 데이터를 상태에 설정
      });
  }, [id]);

  // 멤버 추가
  const addMember = () => {
    axios
      .get(`/gathering/add/member`, {
        params: {
          id,
          member: memberIdText,
        },
      }) // URL에 id 추가
      .then(function (response) {
        console.log(response);
        setMemberIdText("");
        window.location.reload();
      });
  };

  // 멤버 삭제
  const deleteMember = (member) => {
    if (member !== user) {
      // 자신은 삭제 불가
      axios
        .get(`/gathering/delete/member`, {
          params: {
            id,
            member,
          },
        })
        .then(function (response) {
          alert(`${member} 멤버가 삭제되었습니다.`);
          // console.log(response);
          toggleModal2();
          window.location.reload();
        });
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>
        <div className={styles.schedule}>
          <div className={styles.info}>
            <p>시작일: {new Date(schedule.start).toLocaleDateString()}</p>
            <p>
              종료일:{" "}
              {new Date(
                new Date(schedule.start).setDate(
                  new Date(schedule.start).getDate() + 3
                )
              ).toLocaleDateString()}
            </p>
            <p>일정 기간: {schedule.date} 일</p>
            <p>여행 스타일: {schedule.style}</p>
          </div>
          {user === schedule.admin ? (
            <>
            <button className={styles.modalButton} onClick={toggleModal1}>일정 관리</button>
            <button className={styles.modalButton} onClick={toggleModal2}>
              여행 멤버
            </button>
            </>
          ) : null}
          
        </div>
        <div className={styles.map}>
          <Map
            id={id}
            offset={0}
            date={schedule?.date}
            name={schedule?.name}
            style={{ width: "50%" }}
          />
        </div>
      </div>
      {isModalOpen1 ? (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>일정 수정</h2>
            <input
              type="text"
              value={dateText}
              onChange={(e) => setDateText(e.target.value)}
              placeholder={`일자를 입력하세요 1 ~ ${schedule.date}`}
            />
            <button className={styles.button} onClick={addOneDay}>일차 추가</button>
            <button className={styles.button} onClick={delOneDay}>일차 삭제</button>
            <button className={styles.button} onClick={deleteSchedule}>(주의) 일정 전체 삭제</button>
            <button className={styles.button} onClick={toggleModal1}>Close</button>
          </div>
        </div>
      ) : null}
      {isModalOpen2 ? (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Members</h2>
            <ul>
              {members.map((member) => (
                <>
                  <li key={member.member_id}>
                    {member.member_id}{" "}
                    {schedule.admin === member.member_id ? "admin" : null}
                  </li>
                  {user === schedule.admin &&
                  schedule.admin !== member.member_id ? (
                    <div onClick={() => deleteMember(member.member_id)}>
                      삭제
                    </div>
                  ) : null}
                </>
              ))}
            </ul>
            <input
              type="text"
              value={memberIdText}
              onChange={(e) => setMemberIdText(e.target.value)}
              placeholder="Enter member ID"
            />
            <button className={styles.button} onClick={addMember}>Add Member</button>
            <button className={styles.button} onClick={toggleModal2}>Close</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ScheduleInfo;
