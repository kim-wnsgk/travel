const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const session = require("express-session");
const axios = require('axios');

const MemoryStore = require("memorystore")(session);

const app = express();

app.use(
  session({
    secret: "secret key",
    resave: false,
    saveUninitialized: true,
    store: new MemoryStore({
      checkPeriod: 86400000, // 24 hours (= 24 * 60 * 60 * 1000 ms)
    }),
  })
);

const data = require("./route/data");
const festival = require("./route/festival");
const gathering = require("./route/gathering");
const schedule = require("./route/schedule");
const board = require("./route/board");


app.use("/data", data);
app.use("/festival", festival);
app.use("/gathering", gathering);
app.use("/schedule", schedule);
app.use("/board", board);

app.use(cors({
  origin: true, // 모든 출처를 허용
  credentials: true, // credentials 모드를 사용할 경우 true로 설정
}));


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

app.get("/", (req, res) => {
  console.log(req.session)
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

// 백엔드 엔드포인트로 액세스 토큰을 수신하고 처리
app.post("/process-kakao-auth", (req, res) => {
  const { access_token } = req.body;

  axios.get(
    `https://kapi.kakao.com/v2/user/me`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      }
    }
  )
    .then((resp) => {
      console.log(resp)
      req.session.logined = true; // 사용자 로그인 상태를 세션에 저장
      req.session.nickname = resp.data.nickname; // 사용자 닉네임을 세션에 저장
      res.json(resp.data);
    })
    .catch((error) => {
      console.log(error);
    })

});

app.get("/check", (req, res) => {

  res.json(isLoggedIn);
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

//로그인
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
              req.session.logined = true;
              req.session.nickname = username;

              sendData.isLogin = "True";
              console.log(req.session);
              req.session.save(function (err) {
                if (err) {
                  console.error("세션 저장 중 오류 발생:", err);
                } else {
                  // 세션 저장이 완료된 후에 응답을 보낼 수 있음
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
app.get("/authcheck", (req, res, next) => {
  console.log("logined", req.session);
  if (req.session.logined) {
    res.send({ isLogin: "True" });
  } else {
    res.send({ isLogin: "False" });
  }
});

app.get("/getProfile", (req, res, next) => {
  if (req.session.logined) {
    res.send(req.session)
  } else {
    res.send({ isLogin: "False" });
  }
})

app.listen(3001, () => {
  console.log("3001 port running");
});

app.get("/Session", (req, res) => {
  res.send(req.session)
})

