const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();

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

router.get("/select", function (req, res) {
  connection.query(
    `SELECT name, admin FROM gathering WHERE user='${req.query.user}'`,
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

router.get("/insert", function (req, res) {
  var id = "";
  connection.query(
    `INSERT INTO gathering (name, user, admin) VALUES ('${req.query.name}', '${req.query.user}', '${req.query.user}');`,
    function (error, results, fields) {
      if (error) {
        console.log(error);
      } else {
        console.log(results);
        id = results.insertId;
      }
      console.log(id);
      connection.query(
        `insert into schedule_info(id,start,date) values ('${id}', '${req.query.startDate}','${req.query.date_long}');`,
        function (error, results, fileds) {
          if (error) {
            console.log(error);
          } else {
            console.log(results);
          }
        }
      );
    }
  );
});

router.get("/delete", function (req, res) {
  console.log(req.query);
  connection.query(
    `DELETE FROM gathering WHERE name = '${req.query.name}' AND admin = '${req.query.admin}' AND user = '${req.query.user}';`,
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

router.get("/drop", function (req, res) {
  connection.query(
    `DELETE FROM gathering WHERE name = '${req.query.name}' AND admin = '${req.query.user}';`,
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

router.get("/addMem", function (req, res) {
  connection.query(
    `INSERT INTO gathering (name, user, admin) VALUES ('${req.query.name}', '${req.query.user}', '${req.query.admin}');`,
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

module.exports = router;
