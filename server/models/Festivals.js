module.exports = (sequelize, DataTypes) => {
  const Festivals = sequelize.define(
    "Festivals",
    {
      festivalId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
      },
      imageUrl: {
        type: DataTypes.STRING,
      },
      startDate: {
        type: DataTypes.INTEGER,
      },
      endDate: {
        type: DataTypes.INTEGER,
      },
      location: {
        type: DataTypes.STRING,
      },
      tel: {
        type: DataTypes.STRING,
      },
      overview: {
        type: DataTypes.TEXT,
      },
      homepageUrl: {
        type: DataTypes.TEXT,
      },
    },
    {
      charset: "utf8", // 한국어 설정
      collate: "utf8_general_ci", // 한국어 설정
      tableName: "Festivals", // 테이블 이름
      timestamps: true, // createAt & updateAt 활성화
      paranoid: true, // timestamps 가 활성화 되어야 사용 가능 > deleteAt 옵션 on
    },
  );

  Festivals.associate = (models) => {
    Festivals.hasMany(models.Picks, {
      foreignKey: "festivalId",
      sourceKey: "festivalId",
    });
    Festivals.hasMany(models.Reviews, {
      foreignKey: "festivalId",
      sourceKey: "festivalId",
    });
  };

  return Festivals;
};
