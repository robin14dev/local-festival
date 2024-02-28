const express = require("express");
const app = express();
const port = 4002;
const cors = require("cors");
const morgan = require("morgan");
const { db } = require("./models");

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms"),
);
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const indexRouter = require("./routes");
app.use("/", indexRouter);

db.sequelize
  .sync({ force: false }) // 모델 만든거 동기화 해주기!!
  .then(() => {
    console.log("데이터베이스 연결 성공");
    app.listen(port, () => {
      console.log("서버도 연결 성공~~");
    });
  })
  .catch((err) => {
    console.error(err);
  });
