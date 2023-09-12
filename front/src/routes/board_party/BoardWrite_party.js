//import logo from "./logo.svg";
import styles from "./css/BoardWrite_party.module.css";
import UploadFiles from "./fileupload/UploadFiles";
import React from "react";
import EditorComponent from "./quill/EditorComponent";
import { useState } from "react";
import Header from "../../components/Header";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/esm/locale";
import * as dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function BoardWrite_party() {
  const navigate = useNavigate();
  const uploadReferenece = React.createRef();
  const [checked, setChecked] = useState(false);
  const writer = "sls9905"; // 테스트용 아이디
  const date = "22-05-05"; //테스트용 데이트
  const [name, setName] = useState("");
  const [dateDifference, setDateDifference] = useState(0);

  const handleCheckboxChange = (event) => {
    setChecked(event.target.checked);
  };

  async function onClickSearch() {
    await uploadReferenece.current
      .upload()
      .then(function (result) {
        const files = result;
        alert("저장 완료");
      })
      .catch(function (err) {});
  }

  const [boaderTitleText, setBoaderTitleText] = useState("");

  const handleSetValue = (e) => {
    const text = e.target.value;
    setBoaderTitleText(text);
  };

  const [title, setTitle] = useState("");
  const handelTitle = (e) => {
    const titleText = e.target.value;
    console.log(titleText);
    setTitle(titleText);
  };
  const handelName = (e) => {
    const name = e.target.value;
    setName(name);
  };
  const [desc, setDesc] = useState("");
  function onEditorChange(value) {
    setDesc(value);
    console.log(desc);
  }

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  function insert() {
    const oneDay = 24 * 60 * 60 * 1000; // 1일의 밀리초 수
    const diffDays = Math.round(Math.abs((startDate - endDate) / oneDay))+1;
    axios
      .get("http://localhost:3001/gathering/insert", {
        params: {
          name: name,
          user: writer,
          startDate: dayjs(startDate).format("YYYY-MM-DD"),
          date_long: diffDays,
        },
      })
      .then(function (response) {
        console.log(response);
      });
  }
  const [num, setNum] = useState(2);

  const onChangeHandler = (e) => {
    setNum(e.currentTarget.value);
    console.log(e.currentTarget.value);
    console.log(num);
  };

  const Options = [
    { key: 1, value: "1인" },
    { key: 2, value: "2인" },
    { key: 3, value: "3인" },
    { key: 4, value: "4인" },
    { key: 5, value: "5인" },
    { key: 6, value: "6인" },
    { key: 7, value: "7인" },
    { key: 8, value: "8인" },
  ];
  console.log(name);
  return (
    <div className={styles.mainPageContainer}>
      <Header />
      <div className={styles.contentContainer}>
        <div className={styles.boardTitle}>
          제목
          <div className={styles.boaderTitleWrite}>
            <textarea
              className={styles.boardTitleTextArea}
              placeholder="제목을 입력하세요"
              value={title}
              onChange={handelTitle}
            >
              {title}
            </textarea>
          </div>
        </div>
        <div className={styles.boardTitle}>
          모임 이름
          <div className={styles.boaderTitleWrite}>
            <textarea
              className={styles.boardTitleTextArea}
              placeholder="모임 이름을 입력하세요"
              value={name}
              onChange={handelName}
            >
              {name}
            </textarea>
          </div>
        </div>
        <div className={styles.boardFileUpload}>
          {/*파일 올리고 내리고...*/}
          <UploadFiles ref={uploadReferenece} />
        </div>
        <div className={styles.boardDatePicker}>
          <div className={styles.boardStartParty}>
            <span
              style={{
                marginRight: 10,
                whiteSpace: "nowrap",
              }}
            >
              여행 시작일 선택
            </span>
            <DatePicker
              showIcon
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              dateFormat={"yyyy년 MM월 dd일"}
              minDate={new Date()}
            ></DatePicker>
          </div>
          <div className={styles.boardStartParty}>
            <span
              style={{
                marginRight: 10,
                whiteSpace: "nowrap",
              }}
            >
              여행 종료일 선택
            </span>
            <DatePicker
              showIcon
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsStart
              dateFormat={"yyyy년 MM월 dd일"}
              minDate={new Date()}
            ></DatePicker>
            <div>
              <span
                style={{
                  marginLeft: 10,
                  marginRight: 10,
                  whiteSpace: "nowrap",
                }}
              >
                함께 할 인원수
              </span>
            </div>
            <div>
              <select onChange={onChangeHandler} value={num}>
                {Options.map((item, index) => (
                  <option key={item.key} value={item.key}>
                    {item.value}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className={styles.boardContent}>
          <div>
            <EditorComponent
              value={desc}
              onChange={onEditorChange}
            ></EditorComponent>
          </div>
        </div>
        <div className="text-center pd12">
          <button
            className="lf-button primary"
            onClick={() => {
              if (checked == true) {
                insert();
              }
              const boardData = {
                writer: writer,
                title: title,
                content: desc,
                regdate: date,
                start_date: dayjs(startDate).format("YYYY/MM/DD HH:mm:ss"),
                end_date: dayjs(endDate).format("YYYY/MM/DD HH:mm:ss"),
                updatedate: null,
                viewcount: null,
                image: null,
                number: num,
                gather_name: name,
              };
              console.log("테스트중이용~");
              console.log(boardData.start_date);
              console.log(boardData.end_date);
              console.log("테스트중이용~");
              fetch("http://localhost:3001/BoardWrite_party", {
                method: "post",
                headers: {
                  "content-type": "application/json",
                },
                body: JSON.stringify(boardData),
              })
                .then((res) => res.json())
                .then((json) => {
                  if (json.isSuccess === "True") {
                    alert("게시물 작성 성공");
                    navigate(-1);
                  } else {
                    alert(json.isSuccess);
                  }
                });
              alert("게시글 작성 성공");
              navigate(-1);
            }}
          >
            저장
          </button>
          모임 생성
          <input
            type="checkbox"
            checked={checked}
            onChange={handleCheckboxChange}
          />
        </div>
      </div>
    </div>
  );
}

export default BoardWrite_party;
