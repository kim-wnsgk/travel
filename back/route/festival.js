const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();

const connection = require("../db");
connection.connect((error) => {
  if (error) {
    console.error("Error connecting to MySQL server(festival): " + error.stack);
    return;
  }
  console.log(
    "Connected to MySQL server as id(festival) " + connection.threadId
  );
});

router.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
router.use(bodyParser.json({ limit: "50mb" }));

router.get("/show", (req, res) => {
  connection.query(`select * from festival`, function (error, results, fields) {
    console.log(results.length + "개의 데이터");
    if (error) throw error;
    res.json(results);
  });
});

// 여행지 데이터 추가
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
          "INSERT INTO festival (title, addr, image, tel, contentId, eventStartDate, eventEndDate) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            element.title,
            element.addr1,
            element.firstimage,
            element.tel,
            element.contentid,
            element.eventstartdate,
            element.eventenddate,
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

// 여행지 데이터 전부 삭제
router.get("/init", (req, res, next) => {
  connection.query(`truncate festival`, function (error, results, fields) {
    console.log(results);
    if (error) throw error;
    res.json(results);
  });
});

module.exports = router;
