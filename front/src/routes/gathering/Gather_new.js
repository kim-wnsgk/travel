
import React from "react";
import { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import * as dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

function Gather_new() {
    const navigate = useNavigate()
    const [startDate, setStartDate] = useState(new Date());
    const [date_long, setDate_long] = useState();
    const [name, setName] = useState("");
    const onNameChange = (e) => {
        setName(e.target.value);
    };
    const onDateChange = (e) => {
      setDate_long(e.target.value);
  };
    function insert() {
        axios
          .get("http://localhost:3001/gathering/insert", {
            params: {
              name: name,
              user: 12345,
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
        <div>
            <div>
              모임 이름
            <input
              type="name"
              value={name}
              onChange={onNameChange}
              placeholder="모임 이름을 입력해주세요"
            />
            
            <br/>
            시작일
            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
            <br/>
            기간
            <input
            type = "date_long"
            value={date_long}
            onChange={onDateChange}
            maxLength="2"
            placeholder="여행 기간일 입력해주세요(일)"/>
          </div>
          
          <button onClick={insert}>생성하기</button>
        </div>
    );
}

export default Gather_new;