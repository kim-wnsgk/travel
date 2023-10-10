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
    const [user, setUser] = useState('');

    const [members, setMembers] = useState({});
    const [memberIdText, setMemberIdText] = useState('');


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
            .get(`http://localhost:3001/user/getUser`, { withCredentials: true })
            .then(function (response) {
                const { data } = response;
                // console.log(data);
                setUser(data.user); // 데이터를 상태에 설정
            });
    }, [user]);


    const [isModalOpen, setModalOpen] = useState(false);

    const toggleModal = () => {
        setModalOpen(!isModalOpen);
    };

    // 멤버 리스트 가져오기
    useEffect(() => {
        axios
            .get(`http://localhost:3001/gathering/select/members`, {
                params: {
                    id
                }
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
            .get(`http://localhost:3001/gathering/add/member`, {
                params: {
                    id,
                    member: memberIdText
                }
            }) // URL에 id 추가
            .then(function (response) {
                console.log(response);
                setMemberIdText("");
            });
    }

    // 멤버 삭제
    const deleteMember = (member) => {
        if (member !== user) {  // 자신은 삭제 불가
            axios
                .get(`http://localhost:3001/gathering/delete/member`, {
                    params: {
                        id,
                        member
                    }
                })
                .then(function (response) {
                    alert(`${member} 멤버가 삭제되었습니다.`);
                    // console.log(response);
                    toggleModal();
                });
        }

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
                    <button className={styles.modalButton} onClick={toggleModal}>Show Members</button>
                    {/* <input
                        type="text"
                        value={memberId}
                        onChange={onIdChange}
                        placeholder="추가할 멤버 id"
                        className={styles.add}
                    />
                    <button onClick={() => addMember()}>추가</button> */}
                </div>
                <div className={styles.map}>
                    <Map id={schedule?.id} offset={0} date = {schedule?.date} name = {schedule?.name} style={{width:'50%'}}/>
                </div>


            </div>
            {isModalOpen ? (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>Members</h2>
                        <ul>
                            {members.map((member) => (
                                <>
                                    <li key={member.member_id}>{member.member_id}</li>
                                    {user === schedule.admin ?
                                        <div onClick={() => deleteMember(member.member_id)}>삭제</div>
                                        : null}
                                </>
                            ))}
                        </ul>
                        <input
                            type="text"
                            value={memberIdText}
                            onChange={(e) => setMemberIdText(e.target.value)}
                            placeholder="Enter member ID"
                        />
                        <button onClick={addMember}>Add Member</button>
                        <button onClick={toggleModal}>Close</button>
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default ScheduleInfo;
