const express = require("express");
const bycrypt = require("bcrypt");
const passport = require("passport");

const { Post, User } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

const router = express.Router();

//* 미들웨어 확장 패턴
router.post("/login", isNotLoggedIn, (req, res, next) => {
  // POST /user/login
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason);
    }
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        // attributes: ['id', 'nickname', 'email'], // <= 명시된 것만 가져오겠다.
        attributes: {
          exclude: ["password"], // <= 명시된 것만 제외하고 가져오겠다.
        },
        include: [
          {
            model: Post,
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followings",
          },
          {
            model: User,
            as: "Followers",
          },
        ],
      });
      console.log("유저정보확인", fullUserWithoutPassword);
      // res.setHeader('Cookie', 'cxlhy')
      return res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next);
});

router.post("/logout", isLoggedIn, (req, res, next) => {
  // console.log("유저 정보 ===", req.user);
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy();
    res.send("ok");
  });
});

router.get("/", async (req, res, next) => {
  try {
    if (req.user) {
      const user = await User.findOne({
        where: { id: req.user.id },
        attributes: { exclude: ["password"] },
        include: [
          {
            model: Post,
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followings",
          },
          {
            model: User,
            as: "Followers",
          },
        ],
      });
      res.status(200).json(user);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/", isNotLoggedIn, async (req, res, next) => {
  // POST /user/
  try {
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (exUser) {
      return res.status(403).send("이미 사용중인 아이디입니다.");
    }
    const hashedPassword = await bycrypt.hash(req.body.password, 12);
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    res.status(201).send("ok");
  } catch (error) {
    console.error(error);
    next(error); // status 500
  }
});

router.patch("/nickname", isLoggedIn, async (req, res, next) => {
  try {
    await User.update(
      {
        nickname: req.body.nickname,
      },
      {
        where: { id: req.user.id },
      }
    );
    res.status(200).json({ nickname: req.body.nickname });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/followers", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
    });
    if (!user) {
      return res.status(403).send("Ooops!");
    }
    const followers = await user.getFollowers({
      attributes: ["id", "nickname"],
    });
    res.status(200).json(followers);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/followings", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
    });
    if (!user) {
      return res.status(403).send("Ooops!");
    }
    const followings = await user.getFollowings({
      attributes: ["id", "nickname"],
    });
    res.status(200).json(followings);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router
  .route("/:userId/follow", isLoggedIn)
  .patch(async (req, res, next) => {
    try {
      const followUser = await User.findOne({
        where: { id: req.params.userId },
      });
      if (!followUser) {
        return res.status(403).send("유령을 팔로우 하려고 하시네요.");
      }
      await followUser.addFollowers(req.user.id);
      res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
    } catch (error) {
      console.error(error);
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const followUser = await User.findOne({
        where: { id: req.params.userId },
      });
      if (!followUser) {
        return res.status(403).send("유령을 언팔로우 하려고 하시네요.");
      }
      await followUser.removeFollowers(req.user.id);
      res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
    } catch (error) {
      console.error(error);
      next(error);
    }
  });

router.delete("/follower/:userId", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.userId },
    });
    if (!user) {
      return res.status(403).send("잘못된 접근 입니다.");
    }
    await user.removeFollowers(req.user.userId);
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
