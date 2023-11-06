const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const cors = require("cors");
var request = require("request");
router.use(cors());
const connection = require("../db");
require('dotenv').config();
connection.connect((error) => {
  if (error) {
    console.error("Error connecting to MySQL server(data): " + error.stack);
    return;
  }
  console.log("Connected to MySQL server as id(data) " + connection.threadId);
});

router.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
router.use(bodyParser.json({ limit: "50mb" }));

router.get("/show", (req, res) => {
  connection.query(`select * from sight`, function (error, results, fields) {
    console.log(results.length + "개의 데이터");
    if (error) throw error;
    res.json(results);
  });
});

// 여행지 데이터 여러개 추가
router.post("/insert", async (req, res, next) => {
  let errorCount = 0;
  let insertCount = 0;
  const data = req.body.data;

  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    try {
      await connection
        .promise()
        .query(
          "INSERT INTO sight (title, addr, cat, image, tel, contentId, contentTypeId) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            element.title,
            element.addr1,
            element.cat3,
            element.firstimage,
            element.tel,
            element.contentid,
            element.contenttypeid,
          ]
        );
      console.log("Insert data : " + element.title);
      insertCount++;
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        // console.log('Duplicate data : ' + element.title);
        errorCount++;
      } else {
        console.log(
          "Error while inserting data : " +
          error +
          "\ntitle : " +
          JSON.stringify(element)
        );
        errorCount++;
      }
    }
  }

  console.log("에러 or 중복된 데이터 개수 : " + errorCount);
  console.log("추가된 데이터 개수 : " + insertCount);
  res.send("Data inserted successfully.");
});

// 여행지 데이터 1개 추가
router.post("/insertOne", async (req, res, next) => {
  const cat = req.body.cat;
  connection.query(`INSERT INTO sight (title,addr,cat) VALUES(?, ?, ?)`, [req.body.title, req.body.addr, cat], function (error, results, fields) {
    console.log(results);
    if (error) throw error;
  });
  res.send("Data inserted successfully.");
});

// 여행지 데이터 전부 삭제
router.get("/init", (req, res, next) => {
  connection.query(`truncate sight`, function (error, results, fields) {
    console.log(results);
    if (error) throw error;
    res.json(results);
  });
});

router.post("/recommand", (req, res, next) => {
  let type = req.body.type;
  let cat = req.body.cat;
  let region = req.body.region;

  if (type == 12) type = [12, 14];
  if (cat == "A04010120") cat = ["A04010100", "A04010200"];
  else if (cat == "A04010340") cat = ["A04010300", "A04010400"];

  let query = "SELECT * FROM sight";

  let conditions = [];

  if (type && type.length > 0) {
    conditions.push(`contentTypeId IN (${type})`);
  }

  if (region && region.length > 0) {
    conditions.push(`addr LIKE '%${region}%'`);
  }

  if (cat && cat.length > 0) {
    if (Array.isArray(cat)) {
      const catConditions = cat.map((category) => `cat LIKE '${category}%'`);
      conditions.push(`(${catConditions.join(" OR ")})`);
    } else {
      conditions.push(`cat LIKE '${cat}%'`);
    }
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  console.log("query : " + query);

  connection.query(query, function (error, results, fields) {
    if (error) throw error;
    res.json(results);
  });
});

router.get("/addCoordinate", (req, res, next) => {
  // connection.query(`select addr from sight`, function (error, results, fields) {
  // var address = "용인시 수지구 죽전로 152"
  var address
  connection.query(`SELECT contentId,addr FROM travel.sight;`, function (err, res, fields) {
    // var address = res.contentId
    geocodeAddresses(res)
  }
  )
})

function sendRequest(address) {
  return new Promise((resolve, reject) => {
    request({
      method: 'GET',
      url: `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
      headers: {
        'Authorization': `KakaoAK ${process.env.REACT_APP_KAKAO_MAP}`,
      },
    }, function (err, response, body) {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    });
  });
}
async function geocodeAddresses(res) {
  for (const re of res) {
    try {
      const body = await sendRequest(re.addr);
      if (JSON.parse(body).documents[0].x !== undefined) {
        connection.query(`UPDATE sight SET lon = ${JSON.parse(body).documents[0].x}, lat = ${JSON.parse(body).documents[0].y} WHERE contentId = ${re.contentId};`,
          function (err) {
            if (err) {
              throw (err);
            }
          })
      }
      else {
        console.log("err occurred", re.addr)
      }
    } catch (err) {
      console.error("An error occurred:", err);
    }
  }
}

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

module.exports = router;
