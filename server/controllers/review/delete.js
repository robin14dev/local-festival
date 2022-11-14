const { Reviews } = require('../../models');
const validateToken = require('../token-functions/validateToken');

module.exports = async (req, res) => {
  //console.log('delete------------',req.params); // { festivalId: '1307813' }
  const { festivalId, reviewId } = req.params;

  const accessTokenData = validateToken(req);

  if (!accessTokenData) {
    return res.status(404).json({ data: null, message: 'User not logged in' });
  }
  // { account: 'tttt', id: '3', iat: 1658118869 }

  const userId = accessTokenData.id;

  let result = await Reviews.destroy({
    where: {
      festivalId,
      userId,
      id: reviewId,
    },
  });

  res.send({ message: 'ok' });

  //삭제시 필요 : userId(token에 실려옴), festivalId(얘로 수정)
};
