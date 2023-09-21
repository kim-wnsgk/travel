const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");

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
const user = require("./route/user");


app.use("/data", data);
app.use("/festival", festival);
app.use("/gathering", gathering);
app.use("/schedule", schedule);
app.use("/board", board);
app.use("/user", user);

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



app.listen(3001, () => {
  console.log("3001 port running");
});

app.get("/Session", (req, res) => {
  res.send(req.session)
})

