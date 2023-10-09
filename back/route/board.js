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
    function (error, results, fields) {
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

  if (writer && title && content && regdate) {
    connection.query(
      "INSERT INTO board_party (writer, title, content,  start_date, end_date, number,regdate,gather_name) VALUES(?,?,?,?,?,?,CURRENT_TIMESTAMP,?)",
      [writer, title, content, start_date, end_date, number, name]
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

router.get("/BoardList_party", (req, res) => {
  connection.query(
    "SELECT * FROM board_party",
    function (error, results, fields) {
      res.send(results);
    }
  );
});

module.exports = router;
