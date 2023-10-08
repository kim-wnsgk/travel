import Header from '../../components/Header';
import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from "./Mypage.module.css";
import { Link } from 'react-router-dom';
import Gather_new from '../gathering/Gather_new';

function Mypage() {
    const [user, setUser] = useState();
    async function getProfile() {
        try {
            const response = await axios.get("http://localhost:3001/getProfile", { withCredentials: true });
            setUser(response.data.nickname);
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    }
    const [data, setData] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const showModal = () => {
        setModalOpen(true);
    };
    function drop(item) {
        if (window.confirm("정말 삭제합니까?")) {
            axios
                .get("http://localhost:3001/gathering/drop", {
                    params: {
                        name: item,
                        user: user,
                    }
                })
                .then(function (response) {
                    setData(response.data);
                });
            alert("삭제되었습니다.")
        }
    }
    function fetchData() {
        axios
            .get("http://localhost:3001/gathering/select", {
                params: {
                    user: user,
                }
            })
            .then(function (response) {
                console.log(response.data)
                setData(response.data);

            });
    }
    useEffect(() => {
        getProfile()
        fetchData()
    }, [user]);

    return (
        <div className={styles.container}>
            <Header />

            <div className={styles.content}>
                <div className={styles.title}>마이페이지</div>
                <div className={styles.profile}>
                    <div className={styles.image}></div>
                    <div className={styles.detail}>
                        <div className={styles.name}>아이디 : {user}</div>
                        <div className={styles.gender}>성별 : {'남'}</div>
                        <div className={styles.birth}>생년월일 : {'1999.01.01'}</div>
                        <div className={styles.buttons}>
                            <div className={styles.edit}>정보 수정</div>
                            <div className={styles.delete}>회원 탈퇴</div>
                        </div>
                    </div>
                </div>
                <div>
                    <button onClick={showModal}>모임 만들기</button>
                    {modalOpen && <Gather_new setModalOpen={setModalOpen} user={user} />}
                </div>
                <div className={styles.meeting}>
                    <div className={styles.meetingTitle}>참여중인 모임</div>
                    <ol>
                        <li className={styles.meetingList}>강릉 여행</li>
                        <li className={styles.meetingList}>제주 여행</li>
                        <div>
                            {data.length === 0 ? (
                                <p>모임을 생성하거나 모임에 가입하세요!</p>
                            ) : (
                                data?.map((item, index) => (
                                    <li className={styles.meetingList}>
                                        <Link to='/gathering'
                                            state={{
                                                name: item.name,
                                                admin: item.admin
                                            }}
                                        >{item.name} {item.admin}</Link>
                                        <Link to={'/gather_modi'} state={{ name: item.name }}>수정</Link>
                                        <button onClick={() => drop(item.name)}>삭제</button>
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