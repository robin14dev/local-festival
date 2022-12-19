module.exports = (sequelize, DataTypes) => {
  //객체를 리턴하는 함수를 export? 얘도 함수인데??
  //sequelize.define함수에 3가지 params가 들어감 (모델(테이블)명, 컬럼속성, 모델옵션)
  const Users = sequelize.define("Users", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    account: {
      type: DataTypes.STRING(60),
      comment: "비밀번호",
    },
    nickname: {
      type: DataTypes.STRING(72),
    },
    password: {
      type: DataTypes.STRING(100),
    },
  }, {
    charset: "utf8", // 한국어 설정
    collate: "utf8_general_ci", // 한국어 설정
    tableName: "Users", // 테이블 이름
    timestamps: true, // createAt & updateAt 활성화
    paranoid: true, // timestamps 가 활성화 되어야 사용 가능 > deleteAt 옵션 on
  });
  // console.log("what is typeof Users in Users.js", typeof Users);

  Users.associate = models => {
    /**
     * Users안에 있는 "id값"을 "userId라는 컬럼 이름"으로 UserInfo모델에 새로운 컬럼으로 추가한다.
     */
    // Users.hasOne(models.UserInfo, {foreignKey: "userId", sourceKey: 'id'});
    // Users.belongsTo(models.CompanyInformation, {foreignKey: "company_id", sourceKey: "id"});
    Users.hasMany(models.Picks, {foreignKey : "userId", sourceKey:"id"})
    Users.hasMany(models.Reviews, {foreignKey : "userId", sourceKey:"id"})
    

};
  return Users;

  
};