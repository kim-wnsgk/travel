const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const bcrypt = require("bcrypt");

const session = require("express-session");

const MemoryStore = require("memorystore")(session);

const cors = require("cors");
router.use(cors({
    origin: true, // 모든 출처를 허용
    credentials: true, // credentials 모드를 사용할 경우 true로 설정
}));

router.use(
    session({
        secret: "secret key",
        resave: false,
        saveUninitialized: true,
        store: new MemoryStore({
            checkPeriod: 86400000, // 24 hours (= 24 * 60 * 60 * 1000 ms)
        }),
    })
);

const connection = require("../db");
connection.connect((error) => {
    if (error) {
        console.error("Error connecting to MySQL server(user): " + error.stack);
        return;
    }
    console.log(
        "Connected to MySQL server as id(user) " + connection.threadId
    );
});

router.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
router.use(bodyParser.json({ limit: "50mb" }));

// 가입 라우트
router.post("/signup", (req, res) => {
    const id = req.body.userId;
    const password = req.body.userPassword;
    const password2 = req.body.userPassword2;
    const name = req.body.UserName
    const gender = req.body.UserGender
    const birth = req.body.UserBirth
    const sendData = { isSuccess: "" };

    if (id && password && password2) {
        connection.query(
            "SELECT * FROM usertable WHERE id = ?",
            [id],
            function (error, results, fields) {
                if (error) throw error;
                if (results.length <= 0 && password === password2) {
                    const hashedPassword = bcrypt.hashSync(password, 10);

                    connection.query(
                        "INSERT INTO usertable (id, userchn,username, gender,year ) VALUES (?, ?,?,?,?)",
                        [id, hashedPassword, name, gender, birth],
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
router.post("/login", (req, res) => {
    const id = req.body.userId;
    const password = req.body.userPassword;
    const sendData = { isLogin: "" };

    if (id && password) {
        connection.query(
            "SELECT * FROM usertable WHERE id = ?",
            [id],
            function (error, results, fields) {
                if (error) throw error;
                if (results.length > 0) {
                    const user = results[0];

                    bcrypt.compare(password, user.userchn, (err, result) => {
                        if (result === true) {
                            req.session.logined = true;
                            req.session.user = id;

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
router.get("/logout", function (req, res) {
    req.session.destroy(function (err) {
        res.redirect("/");
    });
});

//권한 있으면 True반환 없으면 False반환
router.get("/authcheck", (req, res, next) => {
    console.log("logined", req.session);
    if (req.session.logined) {
        res.send({ isLogin: "True" });
    } else {
        res.send({ isLogin: "False" });
    }
});

// 유저 아이디 세션 가져오기
router.get("/getUser", (req, res, next) => {
    if (req.session.logined) {
        res.send(req.session)
    } else {
        res.send({ isLogin: "False" });
    }
})

// 유저 정보 가져오기
router.get("/getProfile", (req, res, next) => {
    connection.query(
        `SELECT * FROM userTable WHERE id = '${req.query.id}'`,
        function (error, results, fields) {
            if (error) {
                res.json(error);
            } else {
                res.json(results);
            }
        }
    );
})

router.post('/changeProfile', (req, res, next) => {
    const newProfileData = req.body;
    console.log(newProfileData)
    // Build the UPDATE query
    const query = `UPDATE userTable SET name = ?, gender = ?, year = ? WHERE id = ?`;

    const values = [newProfileData.name, newProfileData.gender, newProfileData.year, newProfileData.id];

    connection.query(query, values, (error, results, fields) => {
        if (error) {
            res.status(500).json({ error: error.message });
        } else {
            res.json({ message: "Profile updated successfully" });
        }
    });
});

module.exports = router;