import React from "react";
import styles from "./css/LoginSKC.module.css";

const Login = () => {
  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div className={styles.logoHeaderContainer}>logo</div>
        <div className={styles.menuHedaerContainer}>menu</div>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.logoBox}></div>
        <div className={styles.email}>
          <textarea placeholder="이메일을 입력하세요."></textarea>
        </div>
        <div className={styles.password}>
          <textarea placeholder="패스워드를 입력하세요."></textarea>
        </div>
        <div className={styles.loginOptions}>
          <div className={styles.first}>
            <div className={styles.findEmail}>이메일 찾기</div>
            <div className={styles.resetPassword}>비밀번호 재설정</div>
          </div>
          <div style={styles.second}>
            <div className={styles.createAccount}>회원가입</div>
          </div>
        </div>
        <div className={styles.loginButton}>
          <button type="button">로그인</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
