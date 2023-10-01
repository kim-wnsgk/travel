import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/Header";
import styles from "./ScheduleInfo.module.css"; // CSS 파일 import
import Map from "./MapSch";

function ScheduleInfo() {
    const { id } = useParams();

    const [schedule, setSchedule] = useState({}); // 초기 상태를 빈 객체로 설정

    useEffect(() => {
        axios
            .get(`http://localhost:3001/gathering/select/gathering-scheduleinfo-id?id=${id}`) // URL에 id 추가
            .then(function (response) {
                const { data } = response;
                console.log(data[0]);
                setSchedule(data[0]); // 데이터를 상태에 설정
            });
    }, [id]);

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.content}>
                <div className={styles.schedule}>
                    <h1 className={styles.title}>{schedule.name}</h1>
                    <div className={styles.info}>
                        <p>일정 ID: {schedule.id}</p>
                        <p>어드민: {schedule.admin}</p>
                        <p>멤버 ID: {schedule.user}</p>
                        <p>시작일: {new Date(schedule.start).toLocaleDateString()}</p>
                        <p>일정 기간: {schedule.date} 일</p>
                    </div>
                </div>
                <div className={styles.map}>
                    지도 여기에 넣기
                    {/* <Map style={{ width: '100 %' }} /> */}
                </div>
            </div>
        </div>
    );
}

export default ScheduleInfo;
