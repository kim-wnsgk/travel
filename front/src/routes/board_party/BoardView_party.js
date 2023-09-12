import React, { useEffect, useState } from "react";
import styles from "./css/BoardView_party.module.css";
import Header from "../../components/Header";
import axios from "axios";
import { useLocation } from "react-router-dom";
import * as dayjs from "dayjs";

const BoardView_party = () => {
  const location = useLocation();
  const board_id = location.state.boardData.board_id;
  const board_data = location.state.boardData;
  const writer = "sls9905";
  const [commentData, setCommentData] = useState([]);

  function addMem(user) {
    axios
      .get("http://localhost:3001/gathering/addMem", {
        params: {
          name: board_data.gather_name,
          user: user,
          admin: board_data.writer,
        },
      })
      .then(function (response) {
      });
  }

  useEffect(() => {
    async function fetchData() {
      axios
        .get("http://localhost:3001/BoardView_party_Comment2", {
          params: {
            id: board_id,
          },
        })
        .then(function (response) {
          setCommentData(response.data);
        });
    }
    fetchData();
  }, []);
  const [comment, setComment] = useState("");

  const handleComment = (e) => {
    setComment(e.target.value);
  };
  const submitComment = () => {
    const commentData = {
      comment: comment,
      writer: writer,
      id: board_id,
    };
    //comment의 내용을 db로 전송 -> 내용을 댓글 리스트에 표현.
    fetch("http://localhost:3001/BoardWrite_party_Comment", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(commentData),
    });

    setComment("");
    window.location.reload();
  };

  return (
    <div className={styles.mainPageContainer}>
      <Header />
      <div className={styles.contentContainer}>
        <div className={styles.title}>{board_data.title}</div>
        <div className={styles.date}>
          {dayjs(board_data.regdate).format("YYYY/MM/DD")}
        </div>
        <div className={styles.viewAndWriter}>
          <div>102 Views</div>
          <div className={styles.bar}> </div>
          <div className={styles.writer}>{board_data.writer}</div>
        </div>
        <div className={styles.contentBox}>
          <div>{board_data.content}</div>
        </div>
        <div className={styles.comment}>
          <div className={styles.commentBox}>
            <div className={styles.profileArea}>
              여기에 댓글작성하는 본인 아이디
            </div>
            <div className={styles.writeArea}>
              <div className={styles.wirteAreaInner}>
                <textarea
                  className={styles.commentTextArea}
                  placeholder="다양한 의견이 서로 존중될 수 있도록 다른사람에게 불쾌감을 주는 욕설, 혐오, 비하의 표현이나 타인의 권리를 침해하는 내용은 주의해주세요. 모든 작성자는 본인이 작성한 의견에 대해 법적 책임을 갖는다는 점 유의하시기 바랍니다."
                  onChange={handleComment}
                >
                  {/*추가로 로그인 되어있지 않다면 댓글 작성창 안보이게 하고 댓글작성은 로그인이 필요합니다. 문구 띄우기 */}
                </textarea>
              </div>
            </div>
            <div className={styles.uploadBox}>
              <button className={styles.uploadButton} onClick={submitComment}>
                등록
              </button>
            </div>
          </div>
          <div className={styles.commentList}>댓글 리스트</div>
          <div>
            {commentData.map((p) => (
              <div className={styles.commentBox}>
                <div className={styles.commentWriterBox}>
                  <span className={styles.commentWriter}>{p.writer}</span>
                  {board_data.writer === writer ? (
                    <button className={styles.commentAddParty} onClick={()=>addMem(p.writer)}>
                      모임원 추가
                    </button>
                  ) : null}
                </div>
                <div className={styles.commentRegdate}>
                  {dayjs(p.create_date).format("YYYY/MM/DD")}
                </div>
                <div className={styles.commentContent}>{p.comment}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardView_party;
