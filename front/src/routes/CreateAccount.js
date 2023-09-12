import React from "react";
import styles from "./css/CreateAccount.module.css";

import { FaAirFreshener, FaMailBulk } from "react-icons/fa";

const CreateAccount = () => {
  return (
    <div className={styles.mainPageContainer}>
      <div className={styles.headerContainer}>
        <div className={styles.logoHeaderContainer}>logo</div>
        <div className={styles.menuHedaerContainer}>menu</div>
      </div>
      <div className={styles.contentContainer}>
        <div>우리 사이트에 오신 당신을 환영합니다!(그림같은거)</div>
        <div className={styles.email}>
          <div>이메일</div>

          <textarea placeholder="사용할 이메일을 입력하세요."></textarea>
          <FaAirFreshener
            style={{
              position: "relative",
              right: "383px",
              bottom: "15px",
            }}
          />
        </div>
        <div className={styles.password}>
          <div>패스워드</div>
          <textarea placeholder="사용할 패스워드를 입력하세요."></textarea>
        </div>
        <div className={styles.name}>
          <div>이름</div>
          <textarea placeholder="사용자의 이름을 입력하세요."></textarea>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
