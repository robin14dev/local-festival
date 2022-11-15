const { Picks } = require('../../models');
const validateToken = require('../token-functions/validateToken');
module.exports = async (req, res) => {
  const accessTokenData = validateToken(req);

  if (!accessTokenData) {
    return res.status(404).json({ data: null, message: 'User not logged in' });
  }

  const userId = accessTokenData.id;

  const { festivalId } = req.body; // { festivalId: 2819403 }

  let result = await Picks.create({ userId, festivalId });
  res.json({ message: 'add pick success' });
  return;
};
