import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";
import styles from "./ScheduleInfo.module.css";
import Map from "./MapSch";

function ScheduleInfo() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [schedule, setSchedule] = useState({}); // 초기 상태를 빈 객체로 설정
    const [user, setUser] = useState('');
    const [member, setMember] = useState({});
    const [memberId, setMemberId] = useState('');

    useEffect(() => {
        axios
            .get(`http://localhost:3001/gathering/select/gathering-scheduleinfo-id?id=${id}`) // URL에 id 추가
            .then(function (response) {
                const { data } = response;
                console.log(data[0]);
                setSchedule(data[0]); // 데이터를 상태에 설정
            });
    }, [id]);
    useEffect(() => {
        axios
            .get(`http://localhost:3001/user/getProfile`, { withCredentials: true }) // URL에 id 추가
            .then(function (response) {
                const { data } = response;
                // console.log(data);
                setUser(data.user); // 데이터를 상태에 설정
            });
    }, [user]);
    useEffect(() => {
        axios
            .get(`http://localhost:3001/gathering/select/members`, {
                params: {
                    id
                }
            }) // URL에 id 추가
            .then(function (response) {
                const { data } = response;
                console.log(data[0]);
                setMember(data[0]); // 데이터를 상태에 설정
            });
    }, [id]);
    const onIdChange = (e) => {
        setMemberId(e.target.value);
    };
    const addMember = () => {
        axios
            .post(`http://localhost:3001/gathering/add/member`, {
                params: {
                    id,
                    member: memberId
                }
            }) // URL에 id 추가
            .then(function (response) {
                console.log(response);
            });
    }

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.content}>
                <div className={styles.schedule}>
                    <h1 className={styles.title}>{schedule.name}</h1>
                    <div className={styles.info}>
                        <p>일정 ID: {schedule.id}</p>
                        <p>어드민: {schedule.admin}</p>
                        <p>시작일: {new Date(schedule.start).toLocaleDateString()}</p>
                        <p>일정 기간: {schedule.date} 일</p>
                    </div>
                    {user === schedule.admin ? <div
                        onClick={() => {
                            axios
                                .get("http://localhost:3001/gathering/delete", {
                                    params: {
                                        id: schedule.id
                                    },
                                })
                                .then(function (response) {
                                    alert(`${schedule.name} 일정이 삭제되었습니다.`);
                                    navigate('/schedule');
                                });

                        }}>삭제</div> : null}
                    <input
                        type="text"
                        value={memberId}
                        onChange={onIdChange}
                        placeholder="추가할 멤버 id"
                        className={styles.add}
                    />
                    <button onClick={() => addMember()}>추가</button>
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
