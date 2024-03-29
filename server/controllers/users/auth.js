const { Users } = require('../../models');
const validateToken = require('../token-functions/validateToken');

module.exports = async (req, res) => {
  try {
    const accessTokenData = validateToken(req);

    if (!accessTokenData) {
      return res.status(404).json({ data: null, message: 'No access Token' });
    }

    const { account } = accessTokenData;

    let user = await Users.findOne({ where: { account } });
    const { id, nickname, defaultPic } = user;
    res.json({ info: { userId: id, account, nickname, defaultPic } });
  } catch (error) {
    console.log(error); // 서버 뻑나는거 없애주기
  }
};
