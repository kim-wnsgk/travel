const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const cors = require("cors");
router.use(cors());
const connection = require("../db");
connection.connect((error) => {
  if (error) {
    console.error("Error connecting to MySQL server(board): " + error.stack);
    return;
  }
  console.log("Connected to MySQL server as id(board) " + connection.threadId);
});

router.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
router.use(bodyParser.json({ limit: "50mb" }));

router.get("/boardList", (req, res) => {
  connection.query(
    "SELECT * FROM board_free",
    async function (error, results, fields) {
      const getCommentCount = (data) => {
        return new Promise((resolve, reject) => {
          connection.query(
            `SELECT COUNT(*) AS comment_count FROM board_free_comment WHERE id = ${data.board_id}`,
            function (err, commentResults, fields1) {
              if (err) {
                reject(err);
              } else {
                resolve(commentResults[0].comment_count || 0);
              }
            }
          );
        });
      };

      await Promise.all(
        results.map(async (data, index) => {
          data.comment_count = await getCommentCount(data);
        })
      );
      res.send(results);
    }
  );
});

router.get("/BoardList_party", (req, res) => {
  connection.query(
    "SELECT * FROM board_party",
    async function (error, results, fields) {
      const getCommentCount = (data) => {
        return new Promise((resolve, reject) => {
          connection.query(
            `SELECT COUNT(*) AS comment_count FROM board_party_comment WHERE id = ${data.board_id}`,
            function (err, commentResults, fields1) {
              if (err) {
                reject(err);
              } else {
                resolve(commentResults[0].comment_count || 0);
              }
            }
          );
        });
      };

      await Promise.all(
        results.map(async (data, index) => {
          data.comment_count = await getCommentCount(data);
        })
      );
      res.send(results);
    }
  );
});

router.get("/boardViewComment2", (req, res) => {
  const id = req.query.id;
  connection.query(
    "SELECT * FROM board_free_comment WHERE id = ?",
    [id],
    function (error, results, fields) {
      res.send(results);
    }
  );
});

router.post("/BoardWriteComment", (req, res) => {
  const writer = req.body.writer;
  const id = req.body.id;
  const comment = req.body.comment;
  if (writer && id && comment) {
    connection.query(
      "INSERT INTO board_free_comment (writer, id,comment, create_date) VALUES(?,?,?,CURRENT_TIMESTAMP)",
      [writer, id, comment, 0]
    );
  }
});

router.post("/BoardWrite_party_Comment", (req, res) => {
  const writer = req.body.writer;
  const id = req.body.id;
  const comment = req.body.comment;
  if (writer && id && comment) {
    connection.query(
      "INSERT INTO board_party_comment (writer, id,comment, create_date) VALUES(?,?,?,CURRENT_TIMESTAMP)",
      [writer, id, comment, 0]
    );
  }
});

router.get("/boardView_party_Comment2", (req, res) => {
  const id = req.query.id;
  connection.query(
    "SELECT * FROM board_party_comment WHERE id = ?",
    [id],
    function (error, results, fields) {
      res.send(results);
    }
  );
});

router.post("/BoardWrite", (req, res) => {
  const writer = req.body.writer;
  const title = req.body.title;
  const content = req.body.content;
  const regdate = req.body.regdate;
  const updatedate = req.body.updatedate;
  const viewcount = req.body.viewcount;
  const image = req.body.image;
  const sendData = { isSuccess: "" };

  if (writer && title && content && regdate) {
    console.log("글작성중");
    connection.query(
      "INSERT INTO board_free (writer, title, content, regdate) VALUES(?,?,?,CURRENT_TIMESTAMP)",
      [writer, title, content, 0]
      // 여기 에러남 알아봐야함 ㅠㅠ
      // function (error, data) {
      //   if (error) throw error;
      //   req.session.save(function () {
      //     sendData.isSuccess = "True";
      //     res.send(sendData);
      //   });
      // }
    );
  } else {
    sendData.isSuccess = "제목, 본문을 작성해주세요.";
  }
});

router.post("/BoardWrite_party", (req, res) => {
  console.log("게시글 작성(파티)");
  const writer = req.body.writer;
  const title = req.body.title;
  const content = req.body.content;
  const regdate = req.body.regdate;
  const start_date = req.body.start_date;
  const end_date = req.body.end_date;
  const updatedate = req.body.updatedate;
  const viewcount = req.body.viewcount;
  const image = req.body.image;
  const number = req.body.number;
  const sendData = { isSuccess: "" };
  const name = req.body.gather_name;
  const gather_id = req.body.gather_id;

  if (writer && title && content && regdate) {
    connection.query(
      "INSERT INTO board_party (writer, title, content,  start_date, end_date, number,regdate,gather_name,gather_id) VALUES(?,?,?,?,?,?,CURRENT_TIMESTAMP,?,?)",
      [writer, title, content, start_date, end_date, number, name,gather_id]
      // 여기 에러남 알아봐야함 ㅠㅠ
      // function (error, data) {
      //   if (error) throw error;
      //   req.session.save(function () {
      //     sendData.isSuccess = "True";
      //     res.send(sendData);
      //   });
      // }
    );
  } else {
    sendData.isSuccess = "제목, 본문을 작성해주세요.";
  }
});

router.post("/BoardShareWrite", (req, res) => {
  const writer = req.body.writer;
  const title = req.body.title;
  const content = req.body.content;
  const regdate = req.body.regdate;
  const updatedate = req.body.updatedate;
  const viewcount = req.body.viewcount;
  const image = req.body.image;
  const pid = req.body.pid;

  const sendData = { isSuccess: "" };

  if (writer && title && content && regdate) {
    connection.query(
      "INSERT INTO board_share (writer, title, content, pid, regdate) VALUES(?,?,?,?,CURRENT_TIMESTAMP)",
      [writer, title, content, pid, 0]
    );
  } else {
    sendData.isSuccess = "제목, 본문을 작성해주세요.";
  }
});

router.post("/BoardShareWrite2", (req, res) => {
  // const board_id = req.body.board_id;
  // const sight_id = req.body.sight_id;
  // const start = req.body.start;
  // const end = req.body.end;
  // const offset = req.body.offset;
  // const date = new Date(req.body.date);

  const dataDetail = req.body;
  console.log("데이터 베이스에 들어갈 배열==>" + dataDetail);
  const sendData = { isSuccess: "" };
  // if (board_id && sight_id && start && end && offset) {
  //   connection.query(
  //     "INSERT INTO board_share_schedule (board_id, sight_id, start, end, offset, date) VALUES(?,?,?,?,?,?)",
  //     [board_id, sight_id, start, end, offset, date]
  //   );
  // } else {
  //   sendData.isSuccess = "오류발생.";
  // }
  for (const item of dataDetail) {
    console.log("item.id=>" + item.id);
    connection.query(
      "INSERT INTO board_share_schedule (board_id, sight_id, start, end, offset, date, bid) VALUES(?,?,?,?,?,?,?)",
      [
        item.board_id,
        item.sight_id,
        item.start,
        item.end,
        item.offset,
        new Date(item.date).toISOString().slice(0, 19).replace("T", " "),
        item.id,
      ],
      function (error, results, fields) {
        console.log("에러의 발생 => " + error);
      }
    );
  }
});

router.post("/BoardShareWrite3", (req, res) => {
  const id = req.body.id; // 클라이언트에서 POST로 보낸 데이터

  const query = `SELECT * FROM schedule WHERE id = ?`;

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("쿼리 실행 오류: " + err.message);
      res.status(500).send("서버 오류");
    } else {
      console.log(results);
      res.json(results);
    }
  });
});

router.post("/BoardWrite_share_Comment", (req, res) => {
  const writer = req.body.writer;
  const id = req.body.id;
  const comment = req.body.comment;
  if (writer && id && comment) {
    connection.query(
      "INSERT INTO board_share_comment (writer, id,comment, create_date) VALUES(?,?,?,CURRENT_TIMESTAMP)",
      [writer, id, comment, 0]
    );
  }
});

router.get("/boardView_share_Comment2", (req, res) => {
  const id = req.query.id;
  connection.query(
    "SELECT * FROM board_share_comment WHERE id = ?",
    [id],
    function (error, results, fields) {
      res.send(results);
    }
  );
});

router.get("/boardShareList", (req, res) => {
  connection.query(
    "SELECT * FROM board_share",
    async function (error, results, fields) {
      const getCommentCount = (data) => {
        return new Promise((resolve, reject) => {
          connection.query(
            `SELECT COUNT(*) AS comment_count FROM board_share_comment WHERE id = ${data.board_id}`,
            function (err, commentResults, fields1) {
              if (err) {
                reject(err);
              } else {
                resolve(commentResults[0].comment_count || 0);
              }
            }
          );
        });
      };

      await Promise.all(
        results.map(async (data, index) => {
          data.comment_count = await getCommentCount(data);
        })
      );
      res.send(results);
    }
  );
});

router.get("/getBoardPid", (req, res) => {
  const id = req.query.id;
  connection.query(
    "SELECT pid FROM board_share WHERE board_id = ?",
    [id],
    function (error, results, fields) {
      console.log(results);
      res.send(results);
    }
  );
});

// router.get("/getBoardScheduleData", (req, res) => {
//   const pid = req.query.pid;
//   console.log(pid);
//   connection.query(
//     "SELECT * FROM board_share_schedule WHERE board_id = ?",
//     [pid],
//     function (error, results, fields) {
//       console.log("여기옴");
//       console.log(results);
//       res.send(results);
//     }
//   );
// });

router.get("/getBoardScheduleData", (req, res) => {
  const pid = req.query.pid;
  console.log("front에서 받아온 pid => " + pid);
  connection.query(
    "SELECT * FROM board_share_schedule WHERE board_id = ?",
    [pid],
    function (error, results, fields) {
      console.log("pid로 검색한 결과들 =>" + results + JSON.stringify(results));

      res.send(results);
    }
  );
});

//이거 수정해서 처음에 큰 일정 만든거 insert, 그다음 세부 일정 insert하는거 구현하기
router.post("/insert", (req, res) => {
  const data = req.body.data; // 클라이언트에서 POST로 보낸 데이터

  const insertQuery = `INSERT INTO your_table (column_name) VALUES (?)`;

  db.query(insertQuery, [data], (err, results) => {
    if (err) {
      console.error("INSERT 쿼리 실행 오류: " + err.message);
      res.status(500).send("서버 오류");
    } else {
      // INSERT 성공한 후 다음 INSERT를 실행하거나 다른 동작 수행
      const nextData = "New Data";
      const nextInsertQuery = `INSERT INTO your_table (column_name) VALUES (?)`;

      db.query(nextInsertQuery, [nextData], (nextErr, nextResults) => {
        if (nextErr) {
          console.error("다음 INSERT 쿼리 실행 오류: " + nextErr.message);
          res.status(500).send("서버 오류");
        } else {
          res.json("데이터가 성공적으로 추가되었습니다.");
        }
      });
    }
  });
});
router.get("/viewcount", (req, res) => {
  connection.query(
    `UPDATE board_${req.query.table} SET view_count = view_count + 1 WHERE board_id=${req.query.id};`,
    function (error, results, fields) {
      if (error) {
        console.log(error);
      } else {
        console.log(results);
        res.json(results);
      }
    }
  );
});

module.exports = router;
