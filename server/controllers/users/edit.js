const { Users } = require('../../models');
const validateToken = require('../token-functions/validateToken');

module.exports = async (req, res) => {
  const accessTokenData = validateToken(req);
  if (!accessTokenData) {
    return res.status(404).json({ data: null, message: 'User not logged in' });
  }

  const { nickname } = req.body;
  const { id, account } = accessTokenData;

  Users.update(
    { nickname },
    {
      where: { id },
    }
  ).then((result) => {
    console.log('what is result', result);
    res.json({ data: { userId: id, account, nickname } });
  });
};
