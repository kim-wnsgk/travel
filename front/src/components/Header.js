import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { CgProfile } from "react-icons/cg";

import axios from "axios";

function Header() {
  const navigate = useNavigate();

  const [islogin, setIslogin] = useState(false);
  useEffect(() => {
    // 로그인 확인
    axios.get("http://localhost:3001/user/authcheck", { withCredentials: true })
      .then(response => {
        // 서버로부터 받은 데이터를 사용하여 isLogin 값을 설정
        const { data } = response;
        setIslogin(data.isLogin == "True");
      })
      .catch(error => {
        console.error("Error fetching authcheck:", error);
      });
  }, []);

  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <Link to="/">
          <img src={process.env.PUBLIC_URL + '/logo.png'} />
        </Link>
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
          <div className={styles.menu}>
            <Link to="/schedule" className={styles.link}>
              일정
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.profile}>
        <CgProfile size={"50px"} color="rgb(72, 72, 72)" cursor="pointer" />
        <div className={styles.profileSelector}>
          <div className={styles.profileSelect}>
            {islogin ?
              <Link to="/mypage">내정보</Link> :
              <button className={styles.prof} onClick={() => { alert("먼저 로그인 해주세요"); navigate("/login") }}>내정보</button>}
          </div>
          <div className={styles.profileSelect}>
            {islogin ?
              <Link to="/mypage">정보수정</Link> :
              <button className={styles.prof} onClick={() => { alert("먼저 로그인 해주세요"); navigate("/login") }}>정보수정</button>}
          </div>
          <div className={styles.profileSelect}>
            {islogin ?
              <div onClick={() => {
                axios.get('http://localhost:3001/user/logout', { withCredentials: true });
                window.location.reload();
              }}>
                로그아웃
              </div> :
              <Link to='/login'><div>로그인</div></Link>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
