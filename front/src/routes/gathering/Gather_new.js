
import React from "react";
import { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import * as dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import styles from "./Gather_modi.module.css";
function Gather_new({setModalOpen, user}) {
    const navigate = useNavigate()
    const [startDate, setStartDate] = useState(new Date());
    const [date_long, setDate_long] = useState();
    const [name, setName] = useState("");
    const onNameChange = (e) => {
        setName(e.target.value);
    };
    const quit = () => {
      setModalOpen(false);
  };
    const onDateChange = (e) => {
      setDate_long(e.target.value);
  };
    function insert() {
        axios
          .get("http://localhost:3001/gathering/insert", {
            params: {
              name: name,
              user: user,
              startDate : dayjs(startDate).format('YYYY-MM-DD'),
              date_long : date_long
            },
          })
          .then(function (response) {
            console.log(response);
          });
          alert("모임이 추가되었습니다.")
          navigate(-1);
      }
    return (
      <div className={styles.modalBackground}>
        <div className={styles.modalContainer}>
          <div className={styles.header}>모임 생성</div>
          <table className={styles.tab}>
              <tr>
                <td>
              모임 이름
              </td>
              <td>
            <input
              type="name"
              value={name}
              onChange={onNameChange}
              placeholder="모임 이름을 입력해주세요"
            />
            </td>
            </tr>
            <tr>
              <td>
                시작일
              </td>
              <td>
               <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
              </td>
            </tr>
            <tr>
              <td>
            기간
            </td>
            <td>
            <input
            type = "date_long"
            value={date_long}
            onChange={onDateChange}
            maxLength="2"
            placeholder="여행 기간일 입력해주세요(일)"/>
            </td>
            </tr>
          </table>
          <button onClick={quit}>취소</button><button onClick={()=>{insert();quit()}}>생성하기</button>
        </div>
        </div>
    );
}

export default Gather_new;