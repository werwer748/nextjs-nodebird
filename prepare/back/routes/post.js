const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");

const { Post, Image, Comment, User, Hashtag } = require("../models");
const { isLoggedIn } = require("./middlewares");

const router = express.Router();

try {
  fs.accessSync("uploads"); // uploads 폴더가 없으면 생성
} catch {
  console.log("uploads 폴더가 없으므로 생성합니다.");
  fs.mkdirSync("uploads");
}

AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: "ap-northeast-2",
});
const upload = multer({
  // storage: multer.diskStorage({  //기본적인 multer방식
  //   destination(req, file, done) {
  //     done(null, "uploads");
  //   },
  //   filename(req, file, done) {
  //     const ext = path.extname(file.originalname); // 확장자 추출(.png)
  //     const basename = path.basename(file.originalname, ext); // 파일명 추출
  //     done(null, basename + "_" + new Date().getTime() + ext); // 파일명 + 현재시간 + .확장자 ex) photo123456789.png
  //   },
  // }),
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: "hugonode.s3",
    key(req, file, cb) {
      cb(
        null,
        `original/${Date.now()}_${path.basename(
          encodeURIComponent(file.originalname)
        )}`
      );
    },
  }),
  limits: { fieldSize: 20 * 1024 * 1024 }, // 20MB
});

router.post("/:postId/comment", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send("존재하지 않는 게시글입니다.");
    }
    const comment = await Comment.create({
      content: req.body.content,
      PostId: parseInt(req.params.postId, 10),
      UserId: req.user.id,
    });
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [{ model: User, attributes: ["id", "nickname"] }],
    });
    res.status(201).json(fullComment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/:postId/retweet", isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
      include: [
        {
          model: Post,
          as: "Retweet",
        },
      ],
    });
    if (!post) {
      return res.status(403).send("존재하지 않는 게시글입니다.");
    }
    if (
      req.user.id === post.UserId ||
      (post.Retweet && post.Retweet.UserId === req.user.id)
    ) {
      return res.status(403).send("자신의 글은 리트윗할 수 없습니다.");
    }
    const retweetTargetId = post.RetweetId || post.id; // 리트윗한 게시글이 리트윗한 게시글일 경우 최로 게시글의 아이디를 가져옴
    const exPost = await Post.findOne({
      where: {
        UserId: req.user.id,
        RetweetId: retweetTargetId,
      },
    });
    if (exPost) {
      return res.status(403).send("이미 리트윗했습니다.");
    }
    const retweet = await Post.create({
      UserId: req.user.id,
      RetweetId: retweetTargetId,
      content: "retweet", // 리트윗한 게시글의 내용을 그대로 가져오면 안되기 때문에 임의의 내용을 넣어줌
    });
    const retweetWithPrevPost = await Post.findOne({
      where: { id: retweet.id },
      include: [
        {
          model: Post,
          as: "Retweet",
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
            {
              model: Image,
            },
          ],
        },
        {
          model: User,
          attributes: ["id", "nickname"],
        },
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User, // 댓글 작성자
              attributes: ["id", "nickname"],
            },
          ],
        },
        {
          model: User, // 좋아요
          as: "Likers",
          attributes: ["id"],
        },
      ],
    });
    res.status(201).json(retweetWithPrevPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router
  .route("/:postId/like", isLoggedIn)
  .patch(async (req, res, next) => {
    // PATCH /post/1/like
    try {
      const post = await Post.findOne({
        where: { id: parseInt(req.params.postId, 10) },
      });
      if (!post) {
        return res.status(403).send("게시글이 존재하지 않습니다.");
      }
      await post.addLikers(req.user.id);
      res.json({ PostId: post.id, UserId: req.user.id });
    } catch (error) {
      console.error(error);
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    // DELETE /post/1/like
    try {
      const post = await Post.findOne({
        where: { id: parseInt(req.params.postId, 10) },
      });
      if (!post) {
        return res.status(403).send("게시글이 존재하지 않습니다.");
      }
      await post.removeLikers(req.user.id);
      res.json({ PostId: post.id, UserId: req.user.id });
    } catch (error) {
      console.error(error);
      next(error);
    }
  });

router.post(
  "/images",
  isLoggedIn,
  upload.array("image"), // array: 이미지 여러장, single: 이미지 한장, fields: 이미지 여러장이 다른 인풋으로 입력될때, none: 이미지 없이 데이터만
  // 상기 upload 미들웨어에서 업로드는 끝내주고 req.files에 이미지 정보를 넣어서 아래로 넘겨줌
  async (req, res, next) => {
    try {
      console.log(req.files);
      // res.json(req.files.map((v) => v.filename)); // 기본적인 multer방식
      res.json(
        req.files.map((v) => v.location.replace(/\/original\//, "/thumb/"))
      );
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.patch("/:postId", isLoggedIn, async (req, res, next) => {
  const hashtags = req.body.content.match(/#[^\s#]+/g); // 해시태그 추출

  try {
    await Post.update(
      {
        content: req.body.content,
      },
      {
        where: {
          id: req.params.postId,
          UserId: req.user.id,
        },
      }
    );
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) =>
          Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          })
        )
      ); // result = [[노드, true], [리액트, true]]
      await post.setHashtags(result.map((v) => v[0]));
    }
    res.json({
      PostId: parseInt(req.params.postId, 10),
      content: req.body.content,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/:postId", isLoggedIn, async (req, res, next) => {
  try {
    await Post.destroy({
      where: {
        id: req.params.postId,
        UserId: req.user.id,
      },
    });
    res.json({ PostId: parseInt(req.params.postId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/:postId", async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(404).send("존재하지 않는 게시글입니다.");
    }
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: Post,
          as: "Retweet",
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
            {
              model: Image,
            },
          ],
        },
        {
          model: User,
          attributes: ["id", "nickname"],
        },
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
          ],
        },
        {
          model: User, // 좋아요
          as: "Likers",
          attributes: ["id"],
        },
      ],
    });
    res.status(200).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/", isLoggedIn, upload.none(), async (req, res, next) => {
  try {
    const hashtags = req.body.content.match(/#[^\s#]+/g); // 해시태그 추출
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) =>
          Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          })
        )
      ); // result = [[노드, true], [리액트, true]]
      await post.addHashtags(result.map((v) => v[0]));
    }
    if (req.body.image) {
      if (Array.isArray(req.body.image)) {
        // 이미지 여러개 올리면 image: [image1.png, image2.png]
        const images = await Promise.all(
          req.body.image.map((image) => Image.create({ src: image }))
        );
        await post.addImages(images);
      } else {
        // 이미지가 하나면 image: image1.png
        const image = await Image.create({ src: req.body.image });
        await post.addImages(image);
      }
    }
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User, // 댓글 작성자
              attributes: ["id", "nickname"],
            },
          ],
        },
        {
          model: User, // 게시글 작성자
          attributes: ["id", "nickname"],
        },
        {
          model: User, // 좋아요 누른 사람
          as: "Likers",
          attributes: ["id"],
        },
      ],
    });
    res.status(201).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
