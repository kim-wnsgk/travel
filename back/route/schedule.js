const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
var request = require("request");
const cors = require("cors");
require('dotenv').config()
router.use(cors());
const connection = require("../db");
const { seq } = require("async");
connection.connect((error) => {
  if (error) {
    console.error("Error connecting to MySQL server(schedule): " + error.stack);
    return;
  }
  console.log(
    "Connected to MySQL server as id(schedule) " + connection.threadId
  );
});

// 일정의 시작일, 일수 응답
router.get("/checkDate", function (req, res) {
  connection.query(
    `SELECT * FROM schedule_info where id = ${req.query.id};`,
    // WHERE id IN (
    //     SELECT id
    //     FROM gathering
    //     WHERE name = '${req.query.name}' AND admin = '${req.query.admin}' AND user = '${req.query.admin}'
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

router.get("/addSch", function (req, res) {
  console.log(req.query);
  connection.query(
    `INSERT INTO schedule (id, sight_id, start, end, date, offset) VALUES ('${req.query.id}', '${req.query.sight}', '${req.query.start}', '${req.query.end}', '${req.query.date}','${req.query.offset}');`,
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

router.get("/getSchedule", async function (req, res) {
  const pattern = /^\d{6}$/;
  try {
    const results = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM schedule WHERE id='${req.query.id}' AND offset='${req.query.offset}' order by start asc;`,
        function (error, results, fields) {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });

    for (let i = 0; i < results.length; i++) {
      var sightId = results[i].sight_id;
      if (pattern.test(sightId)) {
        const sightResult = await new Promise((resolve, reject) => {
          connection.query(
            `SELECT title FROM sight WHERE contentid = '${sightId}';`,
            function (error2, results2) {
              if (error2) {
                reject(error2);
              } else {
                resolve(results2);
              }
            }
          );
        });
        if (sightResult.length > 0) {
          results[i].sight_id = sightResult[0].title;
        }
      }
    }

    res.json(results);
  } catch (error) {
    console.log(error);
  }
});

router.get("/delSch", function (req, res) {
  console.log(req.query);
  connection.query(
    `delete from schedule where aid = ${req.query.aid}`,
    function (error, results, fields) {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});

router.get("/convertAddr", function (req, res) {
  connection.query(
    `select * from sight where contentId in (select sight_id from schedule where id=${req.query.id} and offset = ${req.query.offset})`,
    function (error, results, fields) {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
      }
    }
  );
});

router.get("/getDirection", function (req, res) {
  request({
    method: 'GET',
    url: `https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving?start=${req.query.origin}&goal=${req.query.destination}&option=trafast`,
    headers: {
      'X-NCP-APIGW-API-KEY-ID': process.env.REACT_APP_NAVER_MAP_ID,
      'X-NCP-APIGW-API-KEY': process.env.REACT_APP_NAVER_MAP,
    },
    json: true
  }, function (err, response, body) {
    res.json(body.route.trafast[0].summary)
  })
}
)

router.get("/delOneDay", function (req, res) {
  const id = req.query.id;
  const offset = Number(req.query.offset);
  console.log(offset + 'offfset')

  // 첫 번째 쿼리: schedule에서 해당 id와 offset에 맞는 레코드 삭제
  const sql1 = `DELETE FROM schedule WHERE id = ${id} AND offset = ${offset};`;

  connection.query(sql1, function (err, results, fields) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Failed to delete schedule." });
    }

    // 두 번째 쿼리: schedule에서 offset을 조건으로 offset 값 수정
    const sql2 = `UPDATE schedule SET offset = offset - 1 WHERE offset > ${offset} AND id = ${id};`;

    connection.query(sql2, function (err, results, fields) {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Failed to update schedule offset." });
      }

      // 세 번째 쿼리: schedule_info에서 해당 id에 맞는 레코드의 date 값을 수정
      const sql3 = `UPDATE schedule_info SET date = date - 1 WHERE id = ${id};`;

      connection.query(sql3, function (err, results, fields) {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Failed to update schedule_info date." });
        }

        return res.json({ message: "Data updated successfully." });
      });
    });
  });
});


router.get("/addOneDay", function (req, res) {
  const id = req.query.id;
  const offset = Number(req.query.offset);
  console.log(offset + 'offfset')

  // 첫 번째 쿼리: schedule에서 offset을 조건으로 offset 값 수정
  const sql1 = `UPDATE schedule SET offset = offset + 1 WHERE offset >= ${offset} AND id = ${id};`;

  connection.query(sql1, function (err, results, fields) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Failed to update schedule offset." });
    }

    // 두 번째 쿼리: schedule_info에서 해당 id에 맞는 레코드의 date 값을 수정
    const sql2 = `UPDATE schedule_info SET date = date + 1 WHERE id = ${id};`;

    connection.query(sql2, function (err, results, fields) {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Failed to update schedule_info date." });
      }

      return res.json({ message: "Data updated successfully." });
    });
  });
});


router.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
router.use(bodyParser.json({ limit: "50mb" }));

module.exports = router;
