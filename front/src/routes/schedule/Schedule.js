import Header from '../../components/Header';
import styles from './Schedule.module.css';

import { useState } from 'react';
import Pagination from "react-js-pagination";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as dayjs from "dayjs";
import axios from "axios";

function Schedule() {


    const [page, setPage] = useState(1);
    const [items] = useState(5);
    const handlePageChange = (page) => {
        setPage(page);
    };
    const scheduleList = [
        { title: '제주도 여행', date: '23.09.21 ~ 23.09.25', dday: 'D-21' },
        { title: '제주도 여행', date: '23.09.21 ~ 23.09.25', dday: 'D-21' },
        { title: '제주도 여행', date: '23.09.21 ~ 23.09.25', dday: 'D-21' },
        { title: '제주도 여행', date: '23.09.21 ~ 23.09.25', dday: 'D-21' },
        { title: '제주도 여행', date: '23.09.21 ~ 23.09.25', dday: 'D-21' },
        { title: '제주도 여행', date: '23.09.21 ~ 23.09.25', dday: 'D-21' },
        { title: '제주도 여행', date: '23.09.21 ~ 23.09.25', dday: 'D-21' },
        { title: '제주도 여행', date: '23.09.21 ~ 23.09.25', dday: 'D-21' },
        { title: '제주도 여행', date: '23.09.21 ~ 23.09.25', dday: 'D-21' },
        { title: '제주도 여행', date: '23.09.21 ~ 23.09.25', dday: 'D-21' },
        { title: '제주도 여행', date: '23.09.21 ~ 23.09.25', dday: 'D-21' },
        { title: '제주도 여행', date: '23.09.21 ~ 23.09.25', dday: 'D-21' },
        { title: '제주도 여행', date: '23.09.21 ~ 23.09.25', dday: 'D-21' },
        { title: '제주도 여행', date: '23.09.21 ~ 23.09.25', dday: 'D-21' },
        { title: '제주도 여행', date: '23.09.21 ~ 23.09.25', dday: 'D-21' },
        { title: '제주도 여행', date: '23.09.21 ~ 23.09.25', dday: 'D-21' },
        { title: '제주도 여행', date: '23.09.21 ~ 23.09.25', dday: 'D-21' },
        { title: '제주도 여행', date: '23.09.21 ~ 23.09.25', dday: 'D-21' },
        { title: '제주도 여행', date: '23.09.21 ~ 23.09.25', dday: 'D-21' },
        // 다른 일정 항목들 추가
    ];

    const [showModal, setShowModal] = useState(false); // 모달 열림/닫힘 상태를 관리하는 상태 추가
    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const writer = "sls9905"; // 테스트용 아이디

    const [name, setName] = useState("");
    const handelName = (e) => {
        const name = e.target.value;
        setName(name);
    };

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    function insert() {
        const oneDay = 24 * 60 * 60 * 1000; // 1일의 밀리초 수
        const diffDays = Math.round(Math.abs((startDate - endDate) / oneDay)) + 1;
        axios
            .get("http://localhost:3001/gathering/insert", {
                params: {
                    name: name,
                    user: writer,
                    startDate: dayjs(startDate).format("YYYY-MM-DD"),
                    date_long: diffDays,
                },
            })
            .then(function (response) {
                console.log(response);
            });
    }

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.content}>
                <div className={styles.mainTitle}>
                    내 일정
                </div>
                <div className={styles.lists}>
                    {scheduleList &&
                        scheduleList.slice(items * (page - 1), items * (page - 1) + items).map((item, index) => (
                            <div className={styles.list} key={index}>
                                <div className={styles.title}>
                                    {item.title}
                                </div>
                                <div className={styles.date}>
                                    {item.date}
                                </div>
                                <div className={styles.dday}>
                                    {item.dday}
                                </div>
                            </div>
                        ))}
                    <div className={styles.PaginationBox}>
                        <Pagination
                            className={styles.Pagination}
                            activePage={page}
                            itemsCountPerPage={items}
                            totalItemsCount={scheduleList.length - 1}
                            pageRangeDisplayed={5}
                            onChange={handlePageChange}
                            prevPageText={"<"}
                            nextPageText={">"}
                        ></Pagination>
                    </div>
                    <div className={styles.addSchedule}
                        onClick={toggleModal}> {/* 모달 열기 함수를 호출 */}
                        일정 추가
                    </div>
                    {showModal && (
                        <div className={styles.modalBackdrop}>
                            <div className={styles.modal}>
                                <div className={styles.modalHeader}>
                                    <span className={styles.modalTitle}>일정 추가</span>
                                    <span className={styles.closeButton} onClick={toggleModal}>
                                        &times;
                                    </span>
                                </div>
                                <div className={styles.modalContent}>
                                    <div className={styles.name}>
                                        일정 제목
                                        <input
                                            className={styles.boardTitleTextArea}
                                            placeholder="일정 제목을 입력하세요"
                                        />
                                    </div>
                                    <div className={styles.date}>
                                        <div className={styles.startDate}>
                                            <span
                                                style={{
                                                    marginRight: 10,
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                여행 시작일 선택
                                            </span>
                                            <DatePicker
                                                showIcon
                                                selected={startDate}
                                                onChange={(date) => setStartDate(date)}
                                                selectsStart
                                                dateFormat={"yyyy년 MM월 dd일"}
                                                minDate={new Date()}
                                            ></DatePicker>
                                        </div>
                                        <div className={styles.boardStartParty}>
                                            <span
                                                style={{
                                                    marginRight: 10,
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                여행 종료일 선택
                                            </span>
                                            <DatePicker
                                                showIcon
                                                selected={endDate}
                                                onChange={(date) => setEndDate(date)}
                                                selectsStart
                                                dateFormat={"yyyy년 MM월 dd일"}
                                                minDate={new Date()}
                                            ></DatePicker>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.modalFooter}>
                                    <button className={styles.addButton}>추가</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}

export default Schedule;
