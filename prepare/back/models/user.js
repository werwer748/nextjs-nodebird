const Sequelize = require("sequelize");

class User extends Sequelize.Model {
  static initiate(sequelize) {
    User.init(
      {
        email: {
          type: Sequelize.STRING(40), // STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
          allowNull: false, // 필수
          unique: true, // 고유한 값
        },
        nickname: {
          type: Sequelize.STRING(30),
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "User",
        tableName: "users",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    //hasOne <-> BelongsTo 1:1 관계, belognsTo가 있는 쪽에 다른 테이블의 id를 저장하는 컬럼이 생김
    // db.User.hasMany(db.Post);
    // db.User.hasMany(db.Comment);
    // db.User.belongsToMany(db.Post, { through: "Like", as: "Liked" }); // through: 중간 테이블 이름, as: 별칭을 통해 헷갈리지않게
    // db.User.belongsToMany(db.User, {
    //   through: "Follow",
    //   as: "Followers",
    //   foreignKey: "FollowingId",
    // });
    // db.User.belongsToMany(db.User, {
    //   through: "Follow",
    //   as: "Followings",
    //   foreignKey: "FollowerId",
    // });
  }
}

module.exports = User;
