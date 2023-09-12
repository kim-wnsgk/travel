import React, { useEffect } from "react";
import styles from "./css/BoardList_party.module.css";
import { useState } from "react";
import Pagination from "react-js-pagination";
import Header from "../../components/Header";
import { Link } from "react-router-dom";
import axios from "axios";
import * as dayjs from "dayjs";

const BoardList_party = () => {
  //pagination --
  //실제로 데이터 받아오면 여기다가 넣기
  const [data, setData] = useState([]);

  const [page, setPage] = useState(1);
  const [items] = useState(7);

  const handlePageChange = (page) => {
    setPage(page);
  };
  useEffect(() => {
    async function fetchData() {
      try {
        const td = await axios.get("http://localhost:3001/BoardList_party");
        console.log(td.data);
        setData(td.data);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, []);

  return (
    <div className={styles.mainPageContainer}>
      <Header />
      <div className={styles.contentContainer}>
        <div className={styles.BoardListTitle}>함께 여행가요</div>
        <div className={styles.BoardListAttribute}>
          <div className={styles.BoardListAttributeTitle}>제목</div>
          <div className={styles.BoardListAttributeViews}>조회수</div>
          <div className={styles.BoardListAttributeDate}>작성일</div>
          <div className={styles.BoardListAttributeComents}>댓글</div>
          <div className={styles.BoardListAttributeUser}>작성자</div>
        </div>
        <div className={styles.BoardLists}>
          <div className={styles.BoardList}>
            {data
              .slice(items * (page - 1), items * (page - 1) + items)
              .map((p) => (
                <Link
                  to="/BoardView_party"
                  state={{
                    boardData: p,
                  }}
                  className={styles.listLink}
                >
                  <div className={styles.BoardListEach}>
                    <ul
                      style={{
                        marginTop: 5,
                      }}
                    >
                      <li>{p.title}</li>
                      <li>{p.view_count} 구현해야댐</li>
                      <li>{dayjs(p.regdate).format("YYYY/MM/DD")}</li>
                      <li>댓글수 구현</li>
                      <li>{p.writer}</li>
                    </ul>
                    <ul
                      style={{
                        marginTop: 5,
                      }}
                    >
                      <li>여행 일자</li>
                      <li>{dayjs(p.start_date).format("YYYY/MM/DD")}</li>
                      <li>~</li>
                      <li>{dayjs(p.end_date).format("YYYY/MM/DD")}</li>
                    </ul>
                  </div>
                </Link>
              ))}
          </div>
          <div className={styles.PaginationBox}>
            <Pagination
              className={styles.Pagination}
              activePage={page}
              itemsCountPerPage={items}
              totalItemsCount={data.length - 1}
              pageRangeDisplayed={5}
              onChange={handlePageChange}
              prevPageText={"<"}
              nextPageText={">"}
            ></Pagination>
          </div>
          <div>
            <Link to="/BoardWrite_party">
              <div>글작성</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardList_party;
