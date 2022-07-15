module.exports = (sequelize, DataTypes)=>{

  const Picks = sequelize.define("Picks", {
    id : {
      type : DataTypes.INTEGER,
      primaryKey : true
    }
  })


  Picks.associate = models => {
    Picks.belongsTo(models.Users, {foreignKey : "userId", sourceKey : "id"})
    Picks.belongsTo(models.Festivals, {foreignKey : "festivalId", sourceKey : "festivalId"})
  }
  return Picks
}