const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const cors = require("cors");
router.use(cors());
const connection = require("../db");
connection.connect((error) => {
  if (error) {
    console.error(
      "Error connecting to MySQL server(gathering): " + error.stack
    );
    return;
  }
  console.log(
    "Connected to MySQL server as id(gathering) " + connection.threadId
  );
});
router.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
router.use(bodyParser.json({ limit: "50mb" }));

// 해당 user의 모임(일정) 모두 불러오기
router.get("/select", function (req, res) {
  const user = req.query.user;

  // gathering_members 테이블을 사용하여 gathering 테이블과 조인
  const query = `
    SELECT g.id, g.name, g.admin
    FROM gathering_members gm
    JOIN gathering g ON gm.group_id = g.id
    WHERE gm.member_id = '${user}'
  `;

  connection.query(query, function (error, results, fields) {
    if (error) {
      console.log(error);
    } else {
      res.send(results);
    }
  });
});

// 이거 사용하나요? 사용안하면 제거?
router.get("/selMem", function (req, res) {
  connection.query(
    `SELECT user,admin FROM gathering WHERE admin='${req.query.user}' AND name='${req.query.name}'`,
    function (error, results, fields) {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});

//어쩔수 없이 이름으로 가져와야되는듯 ㅠㅠ id가 오토인크리즈라
// router.get("/selName", function (req, res) {
//   const name = req.query.name;
//   connection.query(
//     `SELECT id FROM gathering WHERE name=${name}`,
//     function (error, results, fields) {
//       if (error) {
//         console.log(error);
//       } else {
//         res.send(results);
//       }
//     }
//   );
// });

// 일정 추가 - gathering, schdule_info DB에 추가
router.get("/insert", function (req, res) {
  var id = "";
  var style = req.query.style || "기본 여행"; // 입력값이 비어 있을 때 "기본 여행"을 사용
  connection.query(
    `INSERT INTO gathering (name, admin, style) VALUES ('${req.query.name}', '${req.query.user}', '${style}');`,
    function (error, results, fields) {
      if (error) {
        console.log("이곳 에러" + error);
      } else {
        console.log("result id값" + results.insertId);
        id = results.insertId;
        res.send(results);
      }
      console.log(id);
      connection.query(
        `insert into schedule_info(id,start,date) values ('${id}', '${req.query.startDate}','${req.query.date_long}');`,
        function (error, results, fileds) {
          if (error) {
            console.log("두번째 쿼리 에러" + error);
          } else {
            console.log(results);
          }
        }
      );
      connection.query(
        `insert into gathering_members(group_id,member_id) values ('${id}','${req.query.user}');`,
        function (error, results, fileds) {
          if (error) {
            console.log("세번째 쿼리 에러" + error);
          } else {
            console.log(results);
          }
        }
      );
    }
  );
});

//gathering, schedule_info Join 테이블 중 해당 "user"만 응답
router.get("/select/gathering-userlist", function (req, res) {
  connection.query(
    `SELECT * FROM gathering JOIN gathering_members ON gathering.id = gathering_members.group_id JOIN schedule_info ON gathering.id = schedule_info.id WHERE member_id='${req.query.user}'`,
    function (error, results, fields) {
      if (error) {
        console.log(error);
      } else {
        res.send(results);
      }
    }
  );
});
//gathering, schedule_info Join 테이블 중 해당 "id"만 응답
router.get("/select/gathering-scheduleinfo-id", function (req, res) {
  connection.query(
    `SELECT * FROM gathering JOIN schedule_info ON gathering.id = schedule_info.id WHERE gathering.id=${req.query.id}`,
    function (error, results, fields) {
      if (error) {
        console.log(error);
      } else {
        res.send(results);
      }
    }
  );
});

// 그룹id에 따른 멤버 리스트 응답
router.get("/select/members", function (req, res) {
  connection.query(
    `SELECT member_id FROM gathering_members WHERE group_id='${req.query.id}'`,
    function (error, results, fields) {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});

// 그룹id에 멤버 추가
router.get("/add/member", function (req, res) {
  connection.query(
    `INSERT INTO gathering_members (group_id, member_id) VALUES ('${req.query.id}', '${req.query.member}')`,
    function (error, results, fields) {
      if (error) {
        res.json(error);
      } else {
        res.json(results);
      }
    }
  );
});

// 그룹id의 해당 멤버 삭제
router.get("/delete/member", function (req, res) {
  console.log(req.query);
  connection.query(
    `DELETE FROM gathering_members WHERE group_id = '${req.query.id}' and member_id =  '${req.query.member}'`,
    function (error, results, fields) {
      if (error) {
        res.json(error);
      } else {
        res.json(results);
      }
    }
  );
});

// 해당 id의 일정 삭제
router.get("/delete", function (req, res) {
  console.log(req.query);
  connection.query(
    `DELETE FROM gathering WHERE id = '${req.query.id}';`,
    function (error, results, fields) {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});
// router.get("/delete", function (req, res) {
//   console.log(req.query);
//   connection.query(
//     `DELETE FROM gathering WHERE name = '${req.query.name}' AND admin = '${req.query.admin}' AND user = '${req.query.user}';`,
//     function (error, results, fields) {
//       if (error) {
//         console.log(error);
//       } else {
//         console.log(results);
//         res.json(results);
//       }
//     }
//   );
// });

router.get("/drop", function (req, res) {
  connection.query(
    `DELETE FROM gathering WHERE name = '${req.query.name}' AND admin = '${req.query.user}';`,
    function (error, results, fields) {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});

router.get("/addMem", function (req, res) {
  connection.query(
    `INSERT INTO gathering_members (name, user, admin) VALUES ('${req.query.name}', '${req.query.user}', '${req.query.admin}');`,
    function (error, results, fields) {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});

module.exports = router;
