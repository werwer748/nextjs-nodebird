const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const hpp = require("hpp");
const helmet = require("helmet");

const userRouter = require("./routes/user");
const postRouter = require("./routes/post");
const postsRouter = require("./routes/posts");
const hashtagRouter = require("./routes/hashtag");

const { sequelize } = require("./models");
const passportConfig = require("./passport");

dotenv.config();
const app = express();

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });

passportConfig();

if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
  app.use(hpp());
  app.use(helmet());
} else {
  app.use(morgan("dev"));
}

app.use(
  cors({
    origin: ["http://localhost:3060", "nodebird.com"],
    // origin: true,
    // origin: "*", // credentials: true와 같이 사용 못함
    credentials: true, // 쿠키도 같이 보내줌
  })
);

//프론트에서 업로드 폴더 접근시 경로 설정
app.use("/", express.static(path.join(__dirname, "uploads")));
// 라우터 할당코드 보다 먼저 작성할것!
// 프론트의 요청을 해석하여 req.body에 넣어줌
app.use(express.json()); // json형식의 본문을 처리
app.use(express.urlencoded({ extended: true })); // form으로 넘어온 데이터를 처리
//* 쿠키 세션 관련 세팅
app.use(cookieParser(process.env.COOKIE_SECRET)); // 로그인시 쿠키(의미없는 문자)를 프론트로 보내줌 이걸 해석해서 req.cookies에 넣어줌
app.use(
  session({
    saveUninitialized: false,
    resave: false, // 일단 두 옵션 모두 false => 딱히 true로 할 이유가 없음
    secret: process.env.COOKIE_SECRET,
  })
); // 서버에서 통째로 정보를 가지고있는게 세션 => 근데 이정보가 많아지면 서버가 터짐 => 그래서 쿠키에 id만 가지고 있게끔하고 그걸 패스포트에서 아이디에 매칭시켜서 유저를 가져옴
app.use(passport.initialize());
app.use(passport.session());

/**
 * app.get : 가져오다
 * app.post : 생성하다
 * app.put : 전체 수정
 * app.delete : 제거
 * app.patch : 부분 수정
 * app.options : 찔러보기???
 * app.head : 헤더만 가져오기(잘안씀)
 */

app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/posts", postsRouter);
app.use("/hashtag", hashtagRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

app.listen(3065, () => {
  console.log("서버 실행 중...!");
});
