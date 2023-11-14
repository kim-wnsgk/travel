import react from 'react'
import { useState } from 'react';
import styles from "./Register.module.css";
import { Link } from 'react-router-dom';
function Register() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState(1)
  const [birth, setBirth] = useState()
  console.log(id, password, name, gender, birth)
  return (

    <div className={styles.container}>
      <div className={styles.haveAcc}>이미 계정이 있으신가요?  <Link className={styles.login} to='/login'>로그인</Link></div>
      <div className={styles.headH}>
        <h1>환영합니다!</h1><br></br>
        <p>지금까지 경험하지 못한 경치, 맛, 사람들과의 만남을 찾고 계신가요?<br /> 우리 사이트에서는 그 모든 것을 당신에게 제공합니다.</p>
      </div>


      <div className={styles.form}>
        <p>아이디<br /><input className={styles.inputBox} type="text" onChange={event => {
          setId(event.target.value);
        }} /></p>
        <p>비밀번호<br /><input className={styles.inputBox} type="password" onChange={event => {
          setPassword(event.target.value);
        }} /></p>
        <p>비밀번호 확인<br /><input className={styles.inputBox} type="password" onChange={event => {
          setPassword2(event.target.value);
        }} /></p>
        <div className={styles.middle}>
          <p>이름<br /><input className={styles.inputBox} type="text" onChange={event => {
            setName(event.target.value);
          }} /></p>
          <p>성별<br />
            {gender == 1 ? (
              <div className={styles.gender}>
                <div className={styles.selected} onClick={() => setGender(1)}>남</div>
                <div className={styles.select} onClick={() => setGender(2)}>여</div>
              </div>
            ) : (
              <div className={styles.gender}>
                <div className={styles.select} onClick={() => setGender(1)}>남</div>
                <div className={styles.selected} onClick={() => setGender(2)}>여</div>
              </div>
            )}

          </p>
        </div>
        <p>생년월일<br /><input className={styles.inputBox} type="date" onChange={event => {
          setBirth(event.target.value);
        }} /></p>

        <p><input className={styles.register} type="submit" value="가입하기" onClick={() => {
          const userData = {
            userId: id,
            userPassword: password,
            userPassword2: password2,
            UserName: name,
            UserGender: gender,
            UserBirth: birth

          };
          fetch("/user/signup", { //signin 주소에서 받을 예정
            method: "post", // method :통신방법
            headers: {      // headers: API 응답에 대한 정보를 담음
              'Content-Type': "application/json",
            },
            body: JSON.stringify(userData), //userData라는 객체를 보냄

          })
            .then((res) => res.json())
            .then((json) => {
              if (json.isSuccess === "True") {
                alert('회원가입이 완료되었습니다!')

              }
              else {
                alert(json.isSuccess)
              }
              console.log(userData)
            });
        }} /></p>
      </div>
    </div>
  );
}

export default Register;