import Header from '../../components/Header';
import styles from './Schedule.module.css';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from "react-js-pagination";

function Schedule() {
    const nav = useNavigate();
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
                        onClick={() => nav("/addschedule")}>
                        일정 추가
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Schedule;
