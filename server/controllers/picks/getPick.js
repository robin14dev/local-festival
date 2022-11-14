const { Users, Picks, sequelize } = require('../../models');
const validateToken = require('../token-functions/validateToken');

module.exports = async (req, res) => {
  console.log('get pick!!');
  const accessTokenData = validateToken(req);
  if (!accessTokenData) {
    return res.status(404).json({ data: null, message: 'User not logged in' });
  }

  //픽한 데이터 축제정보 다가져오기
  //유저 아이디가 1인 사람이 픽한 축제정보 다가져오기

  const { id } = accessTokenData;
  let result = await Picks.findAll({
    attributes: ['festivalId'],
    where: { userId: Number(id) },
  });

  let test = await sequelize.query(
    `SELECT 
F.festivalId, F.title, F.imageUrl, F.startDate, F.endDate, F.location, F.tel, F.overview, F.homepageUrl, F.createdAt, F.updatedAt, F.deletedAt
from Festivals as F 
inner join Picks 
On F.festivalId = Picks.festivalId 
inner join Users 
On Picks.userId = Users.id 
where users.id = ${Number(id)}`,
    { type: sequelize.QueryTypes.SELECT }
  );

  //console.log('what is test', test);
  res.json(test);
};
