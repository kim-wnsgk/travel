const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();

const connection = require("../db");
connection.connect((error) => {
  if (error) {
    console.error("Error connecting to MySQL server(schedule): " + error.stack);
    return;
  }
  console.log(
    "Connected to MySQL server as id(schedule) " + connection.threadId
  );
});

router.get("/checkDate", function (req, res) {
  connection.query(
    `SELECT *
    FROM schedule_info
    WHERE id IN (
        SELECT id
        FROM gathering
        WHERE name = '${req.query.name}' AND admin = '${req.query.admin}' AND user = '${req.query.admin}'
    );`,
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
        `SELECT * FROM schedule WHERE id='${req.query.id}' AND offset='${req.query.offset}';`,
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

router.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
router.use(bodyParser.json({ limit: "50mb" }));

module.exports = router;
