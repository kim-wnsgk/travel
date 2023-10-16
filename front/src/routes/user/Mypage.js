import Header from "../../components/Header";
import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Mypage.module.css";
import { Link, useNavigate } from "react-router-dom";
import * as dayjs from "dayjs";

function Mypage() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [profile, setProfile] = useState();
  const [schedules, setSchedules] = useState();

  useEffect(() => {
    axios
      .get(`http://localhost:3001/user/getUser`, { withCredentials: true })
      .then(function (response) {
        const { data } = response;
        setUser(data.user); // 데이터를 상태에 설정
      });
  }, [user]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/user/getUser`, {
        params: {
          id: user,
        },
      })
      .then(function (response) {
        const { data } = response;
        setProfile(data[0]); // 데이터를 상태에 설정
      });
  }, [user]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/gathering/select/gathering-userlist`, {
        params: {
          user,
        },
      })
      .then(function (response) {
        const { data } = response;
        console.log(data);
        setSchedules(data); // 데이터를 상태에 설정
      });
  }, [user]);

  if (!profile)
    return (
      <>
        <Header />
        로그인하세요
      </>
    );
  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.content}>
        <div className={styles.title}>마이페이지</div>
        <div className={styles.profile}>
          <div className={styles.image}></div>
          <div className={styles.detail}>
            <div className={styles.id}>아이디 : {user}</div>
            <div className={styles.name}>이름 : {profile?.name}</div>
            <div className={styles.gender}>
              성별 : {profile?.gender === 1 ? "남자" : "여자"}
            </div>
            <div className={styles.birth}>
              생년월일 : {dayjs(profile?.year).format("YYYY")}
            </div>
            <div className={styles.buttons}>
              <div
                className={styles.edit}
                onClick={() => navigate("/edituser")}
              >
                정보 수정
              </div>
              <div className={styles.delete}>회원 탈퇴</div>
            </div>
          </div>
        </div>
        <div className={styles.gathering}>
          <div className={styles.gatheringTitle}>참여중인 모임</div>
          <ol>
            <div>
              {!schedules ? (
                <p>모임을 생성하거나 모임에 가입하세요!</p>
              ) : (
                schedules.map((item) => (
                  <li
                    className={styles.gatheringList}
                    onClick={() => navigate(`/schedule/info/${item.id}`)}
                  >
                    {item.name}
                  </li>
                ))
              )}
            </div>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default Mypage;
