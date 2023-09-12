//import logo from "./logo.svg";
import styles from "./css/BoardWrite.module.css";
import UploadFiles from "./fileupload/UploadFiles";
import React from "react";
import EditorComponent from "./quill/EditorComponent";
import { useState } from "react";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import BoardView_party from "../board_party/BoardView_party";

function BoardWrite() {
  const navigate = useNavigate();
  const uploadReferenece = React.createRef();

  const writer = "sls9905"; // 테스트용 아이디
  const date = "22-05-05"; //테스트용 데이트

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
  const [desc, setDesc] = useState("");
  function onEditorChange(value) {
    setDesc(value);
    console.log(desc);
  }
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
          <div className={styles.boardFileUpload}>
            {/*파일 올리고 내리고...*/}
            <UploadFiles ref={uploadReferenece} />
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
              const boardData = {
                writer: writer,
                title: title,
                content: desc,
                regdate: date,
                updatedate: null,
                viewcount: null,
                image: null,
              };
              fetch("http://localhost:3001/BoardWrite", {
                method: "post",
                headers: {
                  "content-type": "application/json",
                },
                body: JSON.stringify(boardData),
              })
                .then((res) => res.json())
                .then((json) => {
                  console.log(json.isSuccess)
                  if (json.isSuccess === "True") {
                    alert("게시물 작성 성공");
                    navigate(-1)
                  } else {
                    alert(json.isSuccess);
                  }
                });
            }}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

export default BoardWrite;
