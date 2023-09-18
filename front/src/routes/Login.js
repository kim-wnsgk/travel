import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./css/Login.module.css";

function Login() {
  function session() {
    axios
      .get("http://localhost:3001/session")
      .then(function (response) {
        console.log(response);
      });
  }
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const onIdChange = (e) => {
    setId(e.target.value);
  };

  const [pw, setPw] = useState("");
  const onPwChange = (e) => {
    setPw(e.target.value);
  };
  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <Link to="/">
          <img src="./logo.png" />
        </Link>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.title}>로그인</div>
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
            />
          </div>
          <div className={styles.loginButton}>
            <p>
              <input
                className="btn"
                type="submit"
                value="로그인"
                onClick={() => {
                  const userData = {
                    userId: id,
                    userPassword: pw,
                  };
                  fetch("http://localhost:3001/login", {
                    method: "post",
                    headers: {
                      "content-type": "application/json",
                    },
                    body: JSON.stringify(userData), //userData라는 객체를 보냄
                  })
                    .then((res) => res.json())
                    .then((json) => {
                      if (json.isLogin === "True") {
                        alert("로그인에 성공했습니다.");
                        console.log(json)
                        // navigate('/');
                      } else {
                        alert(json.isLogin);
                      }
                    });
                }}
              />
            </p>
          </div>
          <div className={styles.others}>
            <div className={styles.other}>아이디 찾기</div>
            <div className={styles.other}>비밀번호 찾기</div>
            <Link to='/register'><div className={styles.other}>회원가입</div></Link>
          </div>
        </div>
      </div>
      <button onClick={session}>세션확인</button>
    </div>
  );
}

export default Login;
