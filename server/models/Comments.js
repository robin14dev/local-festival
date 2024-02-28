module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define(
    "Comments",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ref: {
        type: DataTypes.INTEGER,
      },
      step: {
        type: DataTypes.INTEGER,
      },
      ref_order: {
        type: DataTypes.INTEGER,
      },
      child_num: {
        type: DataTypes.INTEGER,
      },
      parent_id: {
        type: DataTypes.INTEGER,
      },
      like_num: {
        type: DataTypes.INTEGER,
      },
      content: {
        type: DataTypes.TEXT,
      },
      is_edit: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      charset: "utf8", // 한국어 설정
      collate: "utf8_general_ci", // 한국어 설정
      tableName: "Comments", // 테이블 이름
      timestamps: true, // createAt & updateAt 활성화
      paranoid: true, // timestamps 가 활성화 되어야 사용 가능 > deleteAt 옵션 on
    },
  );

  Comments.associate = (models) => {
    Comments.belongsTo(models.Users, { foreignKey: "userId", targetKey: "id" });
    Comments.belongsTo(models.Reviews, {
      foreignKey: "reviewId",
      targetKey: "id",
    });
  };
  return Comments;
};
