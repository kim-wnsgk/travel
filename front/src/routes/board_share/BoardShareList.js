import React, { useEffect } from "react";
import styles from "./BoardShareList.module.css";
import { useState } from "react";
import Pagination from "react-js-pagination";
import Header from "../../components/Header";
import { Link } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

const BoardShareList = () => {
  //pagination --
  //실제로 데이터 받아오면 여기다가 넣기
  const [data, setData] = useState([]);
  function viewcount(id){
    axios.get("http://localhost:3001/board/viewcount",{
      params:{
        id : id,
        table : 'share'
      }}).then(function(response){
        console.log(response)
      })
  }
  const [page, setPage] = useState(1);
  const [items] = useState(7);

  const handlePageChange = (page) => {
    setPage(page);
  };

  //session에서 유저 정보 받아오기
  const [user, setUser] = useState();
  const [isLogin, setIsLogin] = useState();
  useEffect(() => {
    async function fetchData() {
      try {
        const td = await axios.get(
          "http://localhost:3001/board/boardShareList"
        );
        setData(td.data);
      } catch (e) {
        console.log(e);
      }
    }
    async function getUser() {
      try {
        const testData = axios
          .get("http://localhost:3001/user/getUser", {
            withCredentials: true,
          })
          .then(function (response) {
            const session = response.data;
            console.log("1");
            console.log(session.isLogin);
            console.log("1");
            setUser(session.user);
            setIsLogin(session.isLogin);
          });
      } catch (error) {
        console.log("Error fetching profile:", error);
      }
    }
    getUser();
    fetchData();
  }, [user]);

  return (
    <div className={styles.mainPageContainer}>
      <Header />
      <div className={styles.contentContainer}>
        <div className={styles.BoardListTitle}>일정공유 게시판</div>
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
                  onClick={()=>viewcount(p.board_id)}
                  to="/BoardShareView"
                  state={{
                    boardData: p,
                  }}
                  className={styles.listLink}
                >
                  <ul className={styles.BoardListEach}>
                    <li>{p.title}</li>
                    <li>{p.view_count}</li>
                    <li>{dayjs(p.regdate).format("YYYY/MM/DD")}</li>
                    <li>{p.comment_count}</li>
                    <li>{p.writer}</li>
                  </ul>
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
            {!isLogin ? (
              <Link to="/BoardShareWrite">
                <div>글작성</div>
              </Link>
            ) : (
              <div>로그인 후 글을 작성해보세요.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardShareList;
