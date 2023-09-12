const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const session = require("express-session");

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

const MySQLStore = require("express-mysql-session")(session);

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
const sessionStore = new MySQLStore(sessionOption);
app.use(
  session({
    key: "session_cookie_name",
    secret: "~",
    store: sessionStore,
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
  res.send("HelloWorld");
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

//권한 있으면 True반환 없으면 False반환
app.get("/authcheck", (req, res) => {
  const sendData = { isLogin: "" };
  if (req.session.is_logined) {
    sendData.isLogin = "True";
  } else {
    sendData.isLogin = "False";
  }
  console.log("is_logined", req.session.is_logined);
});
//로그아웃하면 메인페이지로
app.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    res.redirect("/");
  });
});

app.post("/login", (req, res) => {
  // 데이터 받아서 결과 전송
  const username = req.body.userId;
  const password = req.body.userPassword;
  const sendData = { isLogin: "" };

  if (username && password) {
    // id와 pw가 입력되었는지 확인
    connection.query(
      "SELECT * FROM userTable WHERE username = ?",
      [username],
      function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
          // db에서의 반환값이 있다 = 일치하는 아이디가 있다.

          bcrypt.compare(password, results[0].userchn, (err, result) => {
            // 입력된 비밀번호가 해시된 저장값과 같은 값인지 비교

            if (result === true) {
              console.log("session", req.session);

              req.session.is_logined = true;
              req.session.nickname = username;
              req.session.save(function () {
                sendData.isLogin = "True";
                res.send(sendData);
              });
              console.log("session", req.session);
              connection.query(
                `INSERT INTO logtable (created, username, action, command, actiondetail) VALUES (NOW(), ?, 'login' , ?, ?)`,
                [req.session.nickname, "-", `React 로그인 테스트`],
                function (error, result) {}
              );
            } else {
              // 비밀번호가 다른 경우
              sendData.isLogin = "로그인 정보가 일치하지 않습니다.";
              res.send(sendData);
            }
          });
        } else {
          // db에 해당 아이디가 없는 경우
          sendData.isLogin = "아이디 정보가 일치하지 않습니다.";
          res.send(sendData);
        }
      }
    );
  } else {
    // 아이디, 비밀번호 중 입력되지 않은 값이 있는 경우
    sendData.isLogin = "아이디와 비밀번호를 입력하세요!";
    res.send(sendData);
  }
});

app.post("/signin", (req, res) => {
  // 데이터 받아서 결과 전송
  const username = req.body.userId;
  const password = req.body.userPassword;
  const password2 = req.body.userPassword2;

  const sendData = { isSuccess: "" };

  if (username && password && password2) {
    connection.query(
      "SELECT * FROM userTable WHERE username = ?",
      [username],
      function (error, results, fields) {
        // DB에 같은 이름의 회원아이디가 있는지 확인
        if (error) throw error;
        if (results.length <= 0 && password == password2) {
          // DB에 같은 이름의 회원아이디가 없고, 비밀번호가 올바르게 입력된 경우
          const hasedPassword = bcrypt.hashSync(password, 10); // 입력된 비밀번호를 해시한 값
          connection.query(
            "INSERT INTO userTable (username, userchn) VALUES(?,?)",
            [username, hasedPassword],
            function (error, data) {
              if (error) throw error;
              req.session.save(function () {
                sendData.isSuccess = "True";
                res.send(sendData);
              });
            }
          );
        } else if (password != password2) {
          // 비밀번호가 올바르게 입력되지 않은 경우
          sendData.isSuccess = "입력된 비밀번호가 서로 다릅니다.";
          res.send(sendData);
        } else {
          // DB에 같은 이름의 회원아이디가 있는 경우
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
