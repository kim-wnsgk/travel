import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import styles from "./AddSch.module.css";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

function AddSch({isOpen, contentName, contentId, closeModal}) {
  const [testId, setTestId] = useState("sls9905");
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(0);
  const [selected2, setSelected2] = useState(0);
  const [date, setDate] = useState([]);
  const [value, onChange] = useState("10:00");
  const [value2, onChange2] = useState("10:00");
  const [sight, setSight] = useState("");

  function select(index) {
    setSelected(index);
  }
  function select2(index) {
    setSelected2(index);
  }

  const handleChange = (event) => {
    setSight(event.target.value);
  };

  function fetchData() {
    axios
      .get("http://localhost:3001/gathering/select", {
        params: {
          user: testId,
        },
      })
      .then(function (response) {
        setData(response.data);
      });
  }

  function fetchGathering() {
    if (data[selected]?.name && data[selected]?.admin) {
      axios
        .get("http://localhost:3001/schedule/checkDate", {
          params: {
            name: data[selected].name,
            admin: data[selected].admin,
          },
        })
        .then(function (response) {
          setDate(response.data);
        });
    }
  }

  function addSchedule() {
    let datasight = "";
    if(contentId){
      datasight = contentId
    }
    else{
      datasight = sight
    }

    axios
      .get("http://localhost:3001/schedule/addSch", {
        params: {
          id: date[0]?.id,
          start: value,
          end: value2,
          sight: datasight,
          date: dayjs(date[0]?.start).format("YYYY-MM-DD"),
          offset: selected2,
        },
      })
      .then(function (response) {});
    alert("일정이 추가되었습니다.");
    navigate(-1);
  }
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    fetchGathering();
  }, [data, selected]);

  return (
    <div style={{ display: isOpen ? "block" : "none" }} className={styles.container}>
      <div style={{
          width: 400,
          height:400,
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.35)",
        }}></div>
           <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
          maxWidth: "100%",
          maxHeight: "90%",
          overflowY: "auto",
          backgroundColor: "white",
        }}
      >
      <div>
        모임 :
        <div className={styles.gathering}>
          {data.length === 0 ? (
            <p>참가한 모임이 없습니다.</p>
          ) : (
            data.map((item, index) =>
              index === selected ? (
                <button
                  onClick={() => select(index)}
                  className={styles.gatheringEles}
                >
                  {item.name}
                </button>
              ) : (
                <button
                  onClick={() => select(index)}
                  className={styles.gatheringEle}
                >
                  {item.name}
                </button>
              )
            )
          )}
        </div>
        <div className={styles.gathering}>
          {Array.from({ length: date[0]?.date }, (_, index) =>
            index === selected2 ? (
              <button
                onClick={() => select2(index)}
                className={styles.gatheringEles}
              >
                {index}일차
              </button>
            ) : (
              <button
                onClick={() => select2(index)}
                className={styles.gatheringEle}
              >
                {index}일차
              </button>
            )
          )}
          <br />
        </div>
      </div>
      <div>
        시작시간 : <TimePicker onChange={onChange} value={value} />
      </div>
      <div>
        종료시간 : <TimePicker onChange={onChange2} value={value2} />
      </div>
        {contentId ? 
        <div>장소 : {contentName}</div> :
          <div>장소 : <input onChange={handleChange} value={sight}></input></div>
        }
        <br/>
      <button onClick={addSchedule}>추가하기</button>
      <button onClick={closeModal}>Close</button>
      
      </div>
    </div>
  );
}

export default AddSch;
