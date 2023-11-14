import Header from "../../components/Header";
import styles from "./EditUser.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import * as dayjs from "dayjs";
import useDidMountEffect from "../useDidMountEffect";
import DatePicker from "react-datepicker";

function EditUser() {
  const [user, setUser] = useState("");
  const [profile, setProfile] = useState();

  const [newUser, setNewUser] = useState("");
  const [newName, setNewName] = useState("");
  const [newGender, setNewGender] = useState(1);
  const [newYear, setNewYear] = useState(new Date());

  useEffect(() => {
    axios
      .get(`/user/getUser`, { withCredentials: true })
      .then(function (response) {
        const { data } = response;
        setUser(data.user);
        setNewUser(data.user);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`/user/getUser`, {
        params: {
          id: user,
        },
      })
      .then(function (response) {
        const { data } = response;
        console.log(data[0]);
        setProfile(data[0]);
        setNewName(data[0].name);
        setNewGender(data[0].gender);
        setNewYear(dayjs(data[0].year).format("YYYY-MM-DD"));
      });
  }, [user]);

  const onUserChange = (e) => {
    setNewUser(e.target.value);
  };
  const onNameChange = (e) => {
    setNewName(e.target.value);
  };
  const onGenderChange = (e) => {
    setNewGender(e.target.value);
  };
  const onYearChange = (e) => {
    setNewYear(e);
  };

  const changeProfile = () => {
    const updatedProfile = {
      id: newUser,
      name: newName,
      gender: newGender,
      year: newYear,
    };

    axios
      .post(`/user/changeProfile`, updatedProfile)
      .then(function (response) {
        console.log("프로필이 변경되었습니다.");
      })
      .catch(function (error) {
        console.error("프로필 변경 중 오류 발생:", error);
      });
  };
  return (
    <div className={styles.container}>
      <Header />
      <div>
        <input
          type="text"
          value={newUser}
          onChange={onUserChange}
          className={styles.input}
        />
      </div>
      <div>
        <input
          type="text"
          value={newName}
          onChange={onNameChange}
          className={styles.input}
        />
      </div>
      <div>
        <select
          value={newGender}
          onChange={onGenderChange}
          className={styles.input}
        >
          <option value={1}>남자</option>
          <option value={2}>여자</option>
        </select>
      </div>
      <div>
        {/* <DatePicker
                    showIcon
                    selected={newYear}
                    onChange={(date) => onYearChange(date)}
                    selectsStart
                    dateFormat={"yyyy년 MM월 dd일"}
                    className={styles.input}
                    minDate={new Date()}
                /> */}
      </div>
      <button onClick={() => changeProfile()}>변경하기</button>
    </div>
  );
}

export default EditUser;
