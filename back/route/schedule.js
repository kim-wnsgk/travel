const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
var request = require("request");
const cors = require("cors");
require("dotenv").config();
router.use(cors());
const connection = require("../db");
const { seq } = require("async");
const { json } = require("body-parser");
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
router.get("/getGathering", function (req, res) {
  connection.query(
    `SELECT * FROM gathering where id = ${req.query.id};`,
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

router.get("/addSch2", function (req, res) {
  //여기 지금 date 없고 id 값 안받아와짐 이거 해결해야함
  const data = req.query.data;
  const id = req.query.id;
  for (const item of data) {
    connection.query(
      `INSERT INTO schedule (id, sight_id, start, end, date, offset) VALUES ('${id}', '${
        item.sight_id
      }', '${item.start}', '${item.end}', '${new Date(item.date)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ")}','${item.offset}');`,
      function (error, results, fields) {
        if (error) {
          console.log("에러발생 =>" + error);
        } else {
          console.log("결과 =>" + results);
          //res.json(results);
        }
      }
    );
  }
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
    `SELECT s.*
    FROM sight s
    JOIN schedule sc ON s.contentId = sc.sight_id
    WHERE sc.id = '${req.query.id}' AND sc.offset = '${req.query.offset}'
    ORDER BY sc.start ASC;`,
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
  request(
    {
      method: "GET",
      url: `https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving?start=${req.query.origin}&goal=${req.query.destination}&option=trafast`,
      headers: {
        "X-NCP-APIGW-API-KEY-ID": process.env.REACT_APP_NAVER_MAP_ID,
        "X-NCP-APIGW-API-KEY": process.env.REACT_APP_NAVER_MAP,
      },
      json: true,
    },
    function (err, response, body) {
      res.json(body.route.trafast[0].summary);
    }
  );
});
router.get("/delOneDay", function (req, res) {
  var sql1 = `DELETE FROM schedule WHERE id = ${req.query.id} AND offset = ${req.query.offset};`;
  var sql2 = `UPDATE schedule SET offset = offset -1 WHERE offset > ${req.query.offset} and id=${req.query.id};`;
  var sql3 = `UPDATE schedule_info SET date = date-1 where id = ${req.query.id};`;
  connection.query(sql1 + sql2 + sql3, function (err, results, fields) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Failed to delete schedule." });
    }
  });
});
router.get("/addOneDay", function (req, res) {
  var sql1 = `UPDATE schedule SET offset = offset +1 WHERE offset >= ${req.query.offset} and id=${req.query.id};`;
  var sql2 = `UPDATE schedule_info SET date = date+1 where id = ${req.query.id};`;
  connection.query(sql1 + sql2, function (err, results, fields) {
    if (err) {
      console.log(err);
    } else {
      res.json(results);
    }
  });
});
router.get("/nearPlace",function(req,res){
  id = req.query.id
  tag = req.query.tag
  //경도 변환
  dis_lon = req.query.distance *  0.0115 
  //위도 변환
  dis_lat = req.query.distance * 0.007
  console.log(id,req.query.distance, req.query.tag)
  connection.query(`select title, addr, lat, lon, image from sight where contentId=${req.query.id}`,function(err,result,fields){
    if(err){
      console.log(err)
    }
    else{
      sql = `select contentId,title,addr,lat,lon,image from sight where lat between ${result[0].lat-dis_lat} and ${result[0].lat+dis_lat} and lon between ${result[0].lon-dis_lon} and ${result[0].lon+dis_lon} AND contentId!=${id}`
      if(tag==12){
        sql+= ` and contentTypeId in (12,14); `
      }
      else if(tag==1){
        sql+=';'
      }
      else{
        sql += ` and contentTypeId=${tag};`
      }
      connection.query(sql,
      function(err1,res1,fields1){
        if(err){
          console.log(err)
        }
        else{
          res.json(result.concat(res1))
        }
      })
    }
    })
  })
  router.get("/getData", function (req, res) {
  connection.query(
    `select title,image from sight where contentId=${req.query.id}`,
    function (error, results, fields) {
      if (error) {
        console.log(error);
      } else {
        res.json(results);
        console.log(results);
      }
    }
  );
});
router.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
router.use(bodyParser.json({ limit: "50mb" }));

module.exports = router;
