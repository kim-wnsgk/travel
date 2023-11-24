//import logo from "./logo.svg";
import styles from "./css/BoardWrite_party.module.css";
import UploadFiles from "./fileupload/UploadFiles";
import React from "react";
import EditorComponent from "./quill/EditorComponent";
import { useState, useEffect } from "react";
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
  const [user, setUser] = useState("")
  const date = "22-05-05"; //테스트용 데이트
  const [data,setData] = useState();
  const [name, setName] = useState("");
  const [dateDifference, setDateDifference] = useState(0);
  const [gather_id,setGather_id] = useState(null);
  const [gatherSelect, setGatherSelect] = useState('0');


  const handleCheckboxChange = (event) => {
    setChecked(event.target.checked);
  };

  useEffect(() => {
    axios
      .get("/user/getUser", { withCredentials: true })
      .then(function (response) {
        const session = response.data;
        console.log(session);
        setUser(session.user);
      })
      .catch(function (error) {
        // navigate("/");  로그인 안될시 알림띄우거나 하는식으로 수정
      });
  }, []);
  async function fetchData() {
    await axios
      .get("/gathering/select", {  // gathering_members 테이블에서 자신의 group_id만 해당하는 gathering 테이블 받아오기
        params: {
          user: user
        },
      })
      .then(function (response) {
        console.log("여기",response)
        setData(response.data);
      });
  }
  useEffect(()=>{
    fetchData();
  },[user])
  async function onClickSearch() {
    await uploadReferenece.current
      .upload()
      .then(function (result) {
        const files = result;
        alert("저장 완료");
      })
      .catch(function (err) { });
  }

  const [boaderTitleText, setBoaderTitleText] = useState("");

  const handleSetValue = (e) => {
    const text = e.target.value;
    setBoaderTitleText(text);
  };

  const [title, setTitle] = useState("");
  const handelTitle = (e) => {
    const titleText = e.target.value;
    setTitle(titleText);
  };
  const handelName = (e) => {
    const name = e.target.value;
    setName(name);
  };
  const [desc, setDesc] = useState("");
  function onEditorChange(value) {
    setDesc(value);
  }

  const handelStyle = (e) => {
    const style = e.target.value;
    setStyle(style);
  };

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [style, setStyle] = useState('');

  async function insert() {
    const oneDay = 24 * 60 * 60 * 1000; // 1일의 밀리초 수
    const diffDays = Math.round(Math.abs((startDate - endDate) / oneDay)) + 1;
    axios
      .get("/gathering/insert", {
        params: {
          name,
          user,
          style,
          startDate: dayjs(startDate).format("YYYY-MM-DD"),
          date_long: diffDays,
        },
      })
      .then(function (response) {
        console.log("여기",response.data.insertId);
        setGather_id(response.data.insertId)
      });
  }
  const [num, setNum] = useState(2);

  const onChangeHandler = (e) => {
    setNum(e.currentTarget.value);
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
        <div className={styles.buttonBox}>
        <button
        className={gatherSelect=='1' ? styles.buttonActive : styles.buttonInactive}
        onClick={()=>setGatherSelect('1')}
      >
        기존 모임
      </button>
      <button
        className={gatherSelect=='0' ? styles.buttonActive : styles.buttonInactive}
        onClick={()=>setGatherSelect('0')}
      >새로운 모임</button>
      </div>
      {gatherSelect=='0'?
      <>
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
            {/* <div>
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
            </div> */}
          </div>
          
       
        
        <div className={styles.style}>
          <input
            className={styles.styleInput}
            placeholder="여행 스타일을 입력하세요 (ex. 액티비티)"
            value={style}
            onChange={handelStyle}
          />&nbsp;&nbsp;
          <button className={styles.customButton} onClick={()=>insert()}>모임 생성</button>
        </div>
        </div>
        </>
        :
        <div style={{marginTop:'1%',marginLeft:'1%'}}>
          {data.map((item,index) => (
            <button onClick = {()=>setGather_id(item.id)}className={gather_id==item.id?styles.buttonActive : styles.buttonInactive} key={item.id}>{item.name}</button>
          ))}
        </div>
        }
        <div className={styles.boardFileUpload}>
          {/*파일 올리고 내리고...*/}
          <UploadFiles ref={uploadReferenece} />
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
            style={{marginLeft:'1%'}}
            // className={"lf-button primary"}
            className={styles.customButton}
            onClick={() => {
              if(gather_id==null){
                alert("선택된 모임이 없습니다. 기존 모임을 선택하거나 새로운 모임을 만들어주세요")
              }
              // if (checked == true) {
              //   gather_id = insert();
              // }
              const boardData = {
                writer: user,
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
                gather_id: gather_id,
              };
              console.log("테스트중이용~");
              console.log(boardData.start_date);
              console.log(boardData.end_date);
              console.log("테스트중이용~");
              fetch("/board/BoardWrite_party", {
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
          {/* 모임 생성
          <input
            type="checkbox"
            checked={checked}
            onChange={handleCheckboxChange}
          /> */}
        </div>
      </div>
    </div>
  );
}

export default BoardWrite_party;
