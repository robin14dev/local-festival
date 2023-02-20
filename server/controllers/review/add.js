const { Reviews } = require('../../models');
const validateToken = require('../token-functions/validateToken');

module.exports = async (req, res) => {
  const accessTokenData = validateToken(req);

  console.log('hereefe!!');
  if (!accessTokenData) {
    return res.status(404).json({ data: null, message: 'User not logged in' });
  }

  const { content, rating, festivalId } = req.body;
  const userId = accessTokenData.id;

  let addResult = await Reviews.create({ content, rating, festivalId, userId });

  res.json(addResult);
};
