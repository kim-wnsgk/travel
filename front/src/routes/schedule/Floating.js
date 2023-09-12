import { useEffect, useState } from "react";
import styles from "./Floating.module.css";
import axios from "axios";
import * as dayjs from "dayjs";
function Floating() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(0);
  const [selected2, setSelected2] = useState(0);
  const [date, setDate] = useState([]);
  const [sch, setSch] = useState([]);

  function select(index) {
    setSelected(index);
  }

  function select2(index) {
    setSelected2(index);
  }

  async function fetchData() {
    await axios
      .get("http://localhost:3001/gathering/select", {
        params: {
          user: "sls9905",
        },
      })
      .then(function (response) {
        setData(response.data);
      });
  }
  async function fetchGathering() {
    if (data[selected]?.name && data[selected]?.admin) {
      await axios
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
  async function fetchSch() {
    if (date[0]?.id) {
      await axios
        .get("http://localhost:3001/schedule/getSchedule", {
          params: {
            id: date[0]?.id,
            offset: selected2,
          },
        })
        .then(function (response) {
          setSch(response.data);
          console.log(sch);
        });
    }
  }
  async function delSch(aid){
    await axios.get("http://localhost:3001/schedule/delSch",{
      params:{
        aid : aid
      },
    }).then(function(response){
      alert("삭제되었습니다.")
      window.location.reload()
    })
  }
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchGathering();
  }, [data, selected]);

  useEffect(() => {
    fetchSch();
  }, [selected2,date]);

  return (
    <div className={styles.container}>
      <div className={styles.selGath}>
        {data.length === 0 ? (
          <p>참가한 모임이 없습니다.</p>
        ) : (
          data.map((item, index) =>
            index === selected ? (
              <button
                onClick={() => select(index)}
                className={styles.selButtons}
              >
                {item.name}
              </button>
            ) : (
              <button
                onClick={() => select(index)}
                className={styles.selButton}
              >
                {item.name}
              </button>
            )
          )
        )}
      </div>
      <div className={styles.info}>
        <div className={styles.floatingBannerMain}>
          {dayjs(date[0]?.start).format("YY-MM-DD")}
          <br />
          맛집투어
        </div>
      </div>
      <div className={styles.pickdate}>
        {Array.from({ length: date[0]?.date }, (_, index) =>
          index === selected2 ? (
            <button
              onClick={() => select2(index)}
              className={styles.selButton2s}
            >
              {index+1}일차
            </button>
          ) : (
            <button
              onClick={() => select2(index)}
              className={styles.selButton2}
            >
              {index+1}일차
            </button>
          )
        )}
      </div>
      <div className={styles.schedule}>
        {data.length === 0 ? (
          <p>아직 일정이 없습니다. 추가해주세요.</p>
        ) : (
          sch.map((item, index) => (
            <div className={styles.ele}>
              <div className={styles.schduleSite}>장소 : {item.sight_id}</div>
              <div className={styles.schduleTime}>
                일정 시간 : {item.start} ~ {item.end}
              </div>
              <div onClick={()=>delSch(item.aid)} style={{ textAlign: "right" }}>{item.aid}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Floating;
