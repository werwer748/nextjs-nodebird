const express = require("express");
const cors = require("cors");

const userRouter = require("./routes/user");
const postRouter = require("./routes/post");

const { sequelize } = require("./models");

const app = express();

sequelize
  .sync({ force: true })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });

app.use(
  cors({
    origin: true,
  })
);
// 라우터 할당코드 보다 먼저 작성할것!
// 프론트의 요청을 해석하여 req.body에 넣어줌
app.use(express.json()); // json형식의 본문을 처리
app.use(express.urlencoded({ extended: true })); // form으로 넘어온 데이터를 처리

/**
 * app.get : 가져오다
 * app.post : 생성하다
 * app.put : 전체 수정
 * app.delete : 제거
 * app.patch : 부분 수정
 * app.options : 찔러보기???
 * app.head : 헤더만 가져오기(잘안씀)
 */
// app.get("/", (req, res) => {
//   res.send("hello express");
// });

// app.get("/api", (req, res) => {
//   res.send("hello api");
// });

// app.get("/api/posts", (req, res) => {
//   res.json([
//     { id: 1, content: "hello" },
//     { id: 2, content: "hello2" },
//     { id: 3, content: "hello3" },
//   ]);
// });

app.use("/user", userRouter);
app.use("/post", postRouter);

app.listen(3065, () => {
  console.log("서버 실행 중...!");
});
