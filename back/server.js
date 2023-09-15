const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const session = require("express-session");

const MySQLStore = require("express-mysql-session")(session);
const Memorystore = require('memorystore')(session);

app.use(cors());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));

// db mysql 관련
const connection = require("./db");
connection.connect((error) => {
  if (error) {
    console.error("Error connecting to MySQL server(main): " + error.stack);
    return;
  }
  console.log("Connected to MySQL server as id(main) " + connection.threadId);
});

// router 관련
const data = require("./route/data");
const festival = require("./route/festival");
const gathering = require("./route/gathering");
const schedule = require("./route/schedule");
app.use("/data", data);
app.use("/festival", festival);
app.use("/gathering", gathering);
app.use("/schedule", schedule);

const sessionOption = {
  host: "127.0.0.1",
  user: "manager",
  password: "test1234",
  database: "travel",
  port: 3306,
  clearExpired: true, // 만료된 세션 자동 확인 및 지우기 여부
  checkExpirationInterval: 10000, // 만료된 세션이 지워지는 빈도 (milliseconds)
  expiration: 1000 * 60 * 60 * 2, // 유효한 세션의 최대 기간 2시간으로 설정 (milliseconds)
};

app.use(
  session({
    key: "session",
    secret: "session",
    store: new Memorystore({ checkPeriod: 1000 * 60 * 60 * 24 }),
    resave: false,
    saveUninitialized: true,
    cookie: {
      is_logined: false,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

app.get("/", (req, res) => {
  res.send(req.session);
});

app.post("/query", function (req, res) {
  const query = req.body.query;
  console.log("query : ", query);
  connection.query(query, function (error, results, fields) {
    if (error) throw error;
    res.json(results);
  });
});

app.post("/query2", function (req, res) {
  const query = req.body.query;
  console.log("query : ", query);
  connection.query(query, function (error, results, fields) {
    if (error) throw error;
    res.json(results);
  });
});

// 가입 라우트
app.post("/signup", (req, res) => {
  const username = req.body.userId;
  const password = req.body.userPassword;
  const password2 = req.body.userPassword2;

  const sendData = { isSuccess: "" };

  if (username && password && password2) {
    connection.query(
      "SELECT * FROM usertable WHERE username = ?",
      [username],
      function (error, results, fields) {
        if (error) throw error;
        if (results.length <= 0 && password === password2) {
          const hashedPassword = bcrypt.hashSync(password, 10);

          connection.query(
            "INSERT INTO usertable (username, userchn) VALUES (?, ?)",
            [username, hashedPassword],
            function (error, data) {
              if (error) throw error;
              req.session.save(function () {
                sendData.isSuccess = "True";
                res.send(sendData);
              });
            }
          );
        } else if (password !== password2) {
          sendData.isSuccess = "입력된 비밀번호가 서로 다릅니다.";
          res.send(sendData);
        } else {
          sendData.isSuccess = "이미 존재하는 아이디 입니다!";
          res.send(sendData);
        }
      }
    );
  } else {
    sendData.isSuccess = "아이디와 비밀번호를 입력하세요!";
    res.send(sendData);
  }
});

// 로그인 라우트
app.post("/login", (req, res) => {
  const username = req.body.userId;
  const password = req.body.userPassword;
  const sendData = { isLogin: "" };
  if (username && password) {
    connection.query(
      "SELECT * FROM usertable WHERE username = ?",
      [username],
      function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
          const user = results[0];

          bcrypt.compare(password, user.userchn, (err, result) => {
            if (result === true) {
              req.session.cookie.logined = true;
              req.session.cookie.nickname = username;

              // 세션 저장
              req.session.save(function (err) {
                if (err) {
                  console.error("세션 저장 중 오류 발생:", err);
                } else {
                  sendData.isLogin = "True";
                  console.log(req.session);
                  res.send(sendData);
                }
              });
            } else {
              sendData.isLogin = "로그인 정보가 일치하지 않습니다.";
              res.send(sendData);
            }
          });
        } else {
          sendData.isLogin = "아이디 정보가 일치하지 않습니다.";
          res.send(sendData);
        }
      }
    );
  } else {
    sendData.isLogin = "아이디와 비밀번호를 입력하세요!";
    res.send(sendData);
  }
});

//로그아웃하면 메인페이지로
app.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    res.redirect("/");
  });
});

//권한 있으면 True반환 없으면 False반환
app.get("/authcheck", (req, res) => {
  // const sendData = { isLogin: "" };

  console.log("logined", req.session);
  if (req.session.logined) {
    res.json({ isLogin: "True" });
  } else {
    res.json({ isLogin: "False" });
  }

  // res.json(sendData); // 응답을 보내줌
});


app.listen(3001, () => {
  console.log("3001 port running");
});

///규철 게시판 관련 시작///
app.get("/boardList", (req, res) => {
  connection.query(
    "SELECT * FROM board_free",
    function (error, results, fields) {
      res.send(results);
    }
  );
});

app.get("/BoardList_party", (req, res) => {
  connection.query(
    "SELECT * FROM board_party",
    function (error, results, fields) {
      res.send(results);
    }
  );
});

app.get("/boardViewComment2", (req, res) => {
  const id = req.query.id;
  connection.query(
    "SELECT * FROM board_free_comment WHERE id = ?",
    [id],
    function (error, results, fields) {
      res.send(results);
    }
  );
});

app.post("/BoardWriteComment", (req, res) => {
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

app.post("/BoardWrite_party_Comment", (req, res) => {
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

app.get("/boardView_party_Comment2", (req, res) => {
  const id = req.query.id;
  connection.query(
    "SELECT * FROM board_party_comment WHERE id = ?",
    [id],
    function (error, results, fields) {
      res.send(results);
    }
  );
});

app.post("/BoardWrite", (req, res) => {
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

app.post("/BoardWrite_party", (req, res) => {
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

///규철 게시판 관련 끝///
