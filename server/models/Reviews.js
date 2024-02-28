module.exports = (sequelize, DataTypes) => {
  const Reviews = sequelize.define("Reviews", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
    },
    rating: {
      type: DataTypes.INTEGER,
    },
    like_num: {
      type: DataTypes.INTEGER,
    },
  });
  Reviews.associate = (models) => {
    Reviews.belongsTo(models.Users, { foreignKey: "userId", sourceKey: "id" });
    Reviews.belongsTo(models.Festivals, {
      foreignKey: "festivalId",
      targetKey: "festivalId",
    });
    Reviews.hasMany(models.Comments, {
      foreignKey: "reviewId",
      sourceKey: "id",
    });
  };
  return Reviews;
};
