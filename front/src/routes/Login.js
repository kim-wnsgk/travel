import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./css/Login.module.css";

function Login() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const onIdChange = (e) => {
    setId(e.target.value);
  };

  const [pw, setPw] = useState("");
  const onPwChange = (e) => {
    setPw(e.target.value);
  };
  const handleOnClick = () => {
    {
      const userData = {
        userId: id,
        userPassword: pw,
      };
      axios.post('http://localhost:3001/user/login', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
        .then((response) => {
          const res = response.data;
          if (res.isLogin === 'True') {
            alert('로그인에 성공했습니다.');
            navigate('/');
          } else {
            alert(res.isLogin);
          }
        })
        .catch((error) => {
          console.error('로그인 요청 중 오류 발생:', error);
        });
    }}
  
  const handleOnKeyPress = e => {
    if (e.key === 'Enter') {
      handleOnClick(); // Enter 입력이 되면 클릭 이벤트 실행
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <Link to="/">
          <img src="./logo.png" />
        </Link>
      </div>
      <div className={styles.contentContainer}>
        {/* <div className={styles.title}>로그인</div> */}
        <div className={styles.inputs}>
          <div className={styles.inputContainer}>
            <input
              type="text"
              value={id}
              onChange={onIdChange}
              placeholder="ID를 입력해주세요."
              className={styles.input}
            />
          </div>
          <div className={styles.inputContainer}>
            <input
              type="password"
              value={pw}
              onChange={onPwChange}
              placeholder="비밀번호를 입력해주세요."
              className={styles.input}
              onKeyPress={handleOnKeyPress} 
            />
          </div>
              <input
                className={styles.loginButton}
                type="submit"
                value="로그인"
                onClick={handleOnClick}
              />
          
          <div className={styles.others}>
            <div className={styles.other}>아이디 찾기</div>
            <div className={styles.other}>비밀번호 찾기</div>
            <Link to='/register'><div className={styles.other}>회원가입</div></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
