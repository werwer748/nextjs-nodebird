const Sequelize = require("sequelize");

class Post extends Sequelize.Model {
  static initiate(sequelize) {
    Post.init(
      {
        content: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Post",
        tableName: "posts",
        paranoid: true,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.Post.belongsTo(db.User); //post.addUser
    db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" }); // post.addHashtags
    db.Post.hasMany(db.Comment); // post.addComments, post.getComments <= 이런것도 생김(기본적으로 include를 많이 쓰기때문에 get은 사용성이 떨어짐)
    db.Post.hasMany(db.Image); // post.addImages
    db.Post.belongsToMany(db.User, { through: "Like", as: "Likers" });
    /*
     * User에서 Like로 명명 했기 때문에 무조건 맞춰서 써야함, as: 'Likers'는 구분하기 위한 이름
     * post.addLikers 이런게 생김 => 게시글에 좋아요한 사람을 추가하는 메서드
     * post.removeLikers 이런게 생김 => 게시글에 좋아요한 사람을 삭제하는 메서드
     * Many가 붙으면 복수형의 메서드가 생김.
     * add, get, set, remove, create 등의 메서드가 생김
     */

    db.Post.belongsTo(db.Post, { as: "Retweet" }); // RetweetId 컬럼이 생김 // post.addRetweetId
  }
}

module.exports = Post;
