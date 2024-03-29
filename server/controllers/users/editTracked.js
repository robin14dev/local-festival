const { Users } = require('../../models');
const validateToken = require('../token-functions/validateToken');

module.exports = async (req, res) => {
  console.log('users/edit');
  const accessTokenData = validateToken(req);

  try {
    if (!accessTokenData) {
      return res
        .status(404)
        .json({ data: null, message: 'User not logged in' });
    }

    const { id } = accessTokenData;

    let result = await Users.findOne({
      attributes: ['updatedAt'],
      where: { id },
    });
    res.json({ updatedAt: result.updatedAt });
  } catch (error) {
    console.log(error);
  }
};
