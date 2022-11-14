const { Picks } = require('../../models');
const validateToken = require('../token-functions/validateToken');
module.exports = async (req, res) => {
  console.log('addpick!!!');

  const accessTokenData = validateToken(req);

  if (!accessTokenData) {
    return res.status(404).json({ data: null, message: 'User not logged in' });
  }

  //! 픽됐는지 안됐는지 어케알지? => 클라이언트에서 이미 확인
  console.log(accessTokenData); // { account: 'cccc', id: '1', iat: 1657956823 }
  console.log(req.body);
  const userId = accessTokenData.id;

  const { festivalId } = req.body; // { festivalId: 2819403 }

  // console.log(id, festivalId);

  let result = await Picks.create({ userId, festivalId });
  console.log(result);
  res.send('good');
};
