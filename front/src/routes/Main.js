import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";

import Header from "../components/Header";

import styles from "./css/Main.module.css";
import axios from "axios";

import dayjs from "dayjs";
import Pagination from "react-js-pagination";
import Floating from "./schedule/Floating";

import img2 from "./img/rptlvks.jpg";
import img3 from "./img/picnic5.jpg";
import banner from "./img/banner.png";

function Main() {
  const [testId, setTestId] = useState("sls9905");

  const getMeta = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = url;
    });

  // Usage example:

  const [islogin, setIslogin] = useState(false);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const onSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const searchKeyword = () => {
    try {
      navigate("/searchDetail", {
        state: { searchText },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const enterKeyPress = (e) => {
    if (e.key === "Enter") {
      searchKeyword(); // Enter 입력이 되면 클릭 이벤트 실행
    }
  };

  const [data, setData] = useState({});
  const [random10FData, setRandom10FData] = useState([]);

  const [boardFreeData, setBoardFreeData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const td = await axios.get("http://localhost:3001/boardList");
        setBoardFreeData(td.data);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, []);

  const [boardPartyData, setBoardPartyData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const td = await axios.get("http://localhost:3001/BoardList_party");
        //console.log(td.data);
        setBoardPartyData(td.data);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("http://localhost:3001/query", {
          query:
            "SELECT * FROM sight WHERE cat LIKE 'A0101%' and image LIKE 'h%'",
        });
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (Object.keys(data).length > 0) {
      const randomDatas = [];
      while (randomDatas.length < 10) {
        const randomIndex = Math.floor(Math.random() * data.length);
        const randomData = data[randomIndex];
        if (!randomDatas.includes(randomData)) {
          randomDatas.push(randomData);
        }
      }
      setRandom10FData(randomDatas);
    }
  }, [data]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFPage((prevFPage) => (prevFPage + 1) % 10);
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const [festivalData, setFestivalData] = useState([]);
  const [randomFestivalData, setRandomFestivalData] = useState({});
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.post("http://localhost:3001/query", {
          query: "SELECT * FROM festival WHERE image LIKE 'h%'",
        });
        console.log("ㅗ디ㅣ");
        console.log(response.data);
        console.log("ㅗ디ㅣ");
        setFestivalData(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (Object.keys(festivalData).length > 0) {
      const randomDatas = [];
      while (randomDatas.length < 10) {
        const randomIndex = Math.floor(Math.random() * festivalData.length);
        const randomData = festivalData[randomIndex];
        if (!randomDatas.includes(randomData)) {
          (async () => {
            const img = await getMeta(randomData.image);
            //console.log("안녕");
            //console.log(img.naturalHeight + " " + img.naturalWidth);
            if (img.naturalWidth < 700) {
              // console.log("하이3");
              // console.log("하이3");
            }
          })();
          randomDatas.push(randomData);
        }
      }

      setRandomFestivalData(randomDatas);
      //console.log(randomDatas[0].image);
      //console.log(randomFestivalData[0]);
    }
  }, [festivalData]);

  const [fPage, setFPage] = useState(0);
  const [fPage2, setFPage2] = useState(0);

  const fNext = () => {
    if (fPage == 9) setFPage(0);
    else setFPage(fPage + 1);
  };
  const fPrevious = () => {
    if (fPage == 0) setFPage(9);
    else setFPage(fPage - 1);
  };

  //pagination --
  //실제로 데이터 받아오면 여기다가 넣기

  const [page2, setPage2] = useState(1);
  const [page, setPage] = useState(1);
  const [items] = useState(7);

  const handlePageChange = (page) => {
    setPage(page);
  };

  ////////
  return (
    <div className={styles.mainPageContainer}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <Link to="/">
            <img src="./logo44.png" />
          </Link>
        </div>
        <div className={styles.profile}>
          <CgProfile size={"50px"} color="rgb(72, 72, 72)" cursor="pointer" />
          <div className={styles.profileSelector}>
            <div className={styles.profileSelect}>
              <Link to="/mypage">내정보</Link>
            </div>
            <div className={styles.profileSelect}>
              <Link to="./">정보 수정</Link>
            </div>
            <div className={styles.profileSelect}>
              {islogin ? <div>로그아웃</div> : <div>로그인</div>}
              <Link to="./">로그아웃</Link>
            </div>
          </div>
        </div>
        <div className={styles.menuContainer}>
          <div className={styles.menus}>
            <div className={styles.menu}>
              <Link to="/recommand" className={styles.link}>
                여행지 추천
              </Link>
            </div>
            <div className={styles.menu}>
              <Link to="/regions" className={styles.link}>
                관광지 보기
              </Link>
              <ul className={styles.subMenu}>
                <li>
                  <Link to="/submenu1">시, 도 지역별</Link>
                </li>
              </ul>
            </div>
            <div className={styles.menu}>
              <Link to="/boardList" className={styles.link}>
                게시판
              </Link>
              <ul className={styles.subMenu}>
                <li>
                  <Link to="/boardList">자유 게시판</Link>
                </li>
                <li>
                  <Link to="/boardList_party">함께가요 게시판</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.imageContainer}>
        <AiFillCaretLeft
          size={50}
          color="white"
          className={styles.imageLeft}
          cursor="pointer"
          onClick={() => fPrevious()}
        />
        <AiFillCaretRight
          size={50}
          color="white"
          className={styles.imageRight}
          cursor="pointer"
          onClick={() => fNext()}
        />
        <form className={styles.searchForm}>
          <input
            type="text"
            value={searchText}
            onChange={onSearchChange}
            placeholder="검색어를 입력해주세요."
            className={styles.search}
            onKeyPress={enterKeyPress}
          />
        </form>
        <Link to="/regiondetail" state={{ data: random10FData[fPage] }}>
          {random10FData.length > 0 && (
            <div>
              <img
                src={random10FData[fPage].image}
                style={{ height: "700px", width: "100%", objectFit: "cover" }}
              />
              <div className={styles.imageInfo}>
                <h3>{random10FData[fPage].title}</h3>
                <h4>{random10FData[fPage].addr}</h4>
              </div>
            </div>
          )}
        </Link>
      </div>
      <div className={styles.testBOOOOOOOX}></div>
      <div className={styles.banner}>
        <img
          src={banner}
          style={{
            position: "absolute",
            top: "800px",
            zIndex: "-1",
            width: "100%",
          }}
        />
      </div>

      <div className={styles.testWrap}>
        <div className={styles.containerFaker}></div>
        <div className={styles.contentContainer}>
          <div className={styles.bannerOnText}>
            {randomFestivalData[fPage2] && (
              <>
                <h2 className={styles.bannerOnTextH2}>
                  {randomFestivalData[fPage2].title}
                </h2>
                <p className={styles.bannerOnTextP}>
                  {randomFestivalData[fPage2].addr} <br />
                  {randomFestivalData[fPage2].eventStartDate} ~{" "}
                  {randomFestivalData[fPage2].eventEndDate}
                </p>
              </>
            )}
          </div>
          <div className={styles.festivalContainer}>
            {randomFestivalData.length > 0 && (
              <div className={styles.imageWrap}>
                <img
                  src={randomFestivalData[fPage2].image}
                  style={{ width: "100%" }}
                />
              </div>
            )}
          </div>
          <div className={styles.line3}></div>
          <div className={styles.boardUp}>
            <div className={styles.boardImg}>
              <img
                src={img3}
                style={{
                  width: "100%",
                  width: "900px",
                  verticalAlign: "middle",
                }}
              ></img>
            </div>
            <div className={styles.boardTextBox}>
              <p className={styles.boardText1}>우리 함께 소통해 볼까요?</p>

              <p className={styles.boardText2}>
                자유게시판을 활용해 자유롭게 소통하고,
              </p>

              <p className={styles.boardText3}>
                함께 가요 게시판을 활용해 모임을 구성해 보세요!
              </p>
            </div>
          </div>
          <div className={styles.boardViews}>
            <div className={styles.boardFree}>
              <div className={styles.boardTitle}>자유 게시판</div>
              <div className={styles.line}></div>
              <div className={styles.contents}>
                {boardFreeData.map((p) => (
                  <Link
                    to="/BoardView"
                    state={{
                      boardData: p,
                    }}
                    className={styles.listLink}
                  >
                    <ul className={styles.BoardListEach}>
                      <li className={styles.title}>{p.title}　</li>
                      <li className={styles.commentsNum}>({"3"})</li>
                      <li className={styles.writer}>{p.writer}</li>
                    </ul>
                    <div className={styles.line2}></div>
                  </Link>
                ))}
                <div className={styles.PaginationBox}>
                  <Pagination
                    className={styles.Pagination}
                    activePage={page}
                    itemsCountPerPage={items}
                    totalItemsCount={boardFreeData.length - 1}
                    pageRangeDisplayed={5}
                    onChange={handlePageChange}
                    prevPageText={"<"}
                    nextPageText={">"}
                  ></Pagination>
                </div>
              </div>
            </div>
            <div className={styles.boardParty}>
              <div className={styles.boardTitle}>함께 가요 게시판</div>
              <div className={styles.line}></div>
              <div className={styles.contents}>
                {boardPartyData.map((p) => (
                  <Link
                    to="/BoardView"
                    state={{
                      boardData: p,
                    }}
                    className={styles.listLink}
                  >
                    <ul className={styles.BoardListEach}>
                      <li className={styles.title}>{p.title}　</li>
                      <li className={styles.commentsNum}>({"3"})</li>
                      <li className={styles.writer}>{p.writer}</li>
                    </ul>
                    <div className={styles.line2}></div>
                  </Link>
                ))}
                <div className={styles.PaginationBox}>
                  <Pagination
                    className={styles.Pagination}
                    activePage={page}
                    itemsCountPerPage={items}
                    totalItemsCount={boardPartyData.length - 1}
                    pageRangeDisplayed={5}
                    onChange={handlePageChange}
                    prevPageText={"<"}
                    nextPageText={">"}
                  ></Pagination>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.floatingContainer}>
          <div className={styles.floatingBanner}>
            <Floating />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
