// exports.isLoggedIn = (err, req, res, next) => {
exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated((err) => {})) {
    console.log("isLoggedin 미들웨어 통과");
    next(); // next가 비어있으면 다음함수 무언가 전달하면 에러로
  } else {
    // console.error(err);
    res.status(401).send("로그인이 필요합니다.");
  }
};

// exports.isNotLoggedIn = (err, req, res, next) => {
exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    console.log("isNotLoggedIn 미들웨어 통과");
    next();
  } else {
    // console.error(err);
    res.status(401).send("로그인하지 않은 사용자만 접근 가능합니다.");
  }
};
