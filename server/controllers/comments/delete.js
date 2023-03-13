const { Comments } = require('../../models');
const validateToken = require('../token-functions/validateToken');

module.exports = async (req, res) => {
  const { id } = req.body;
  const accessTokenData = validateToken(req);

  if (!accessTokenData) {
    return res.status(404).json({ data: null, message: 'User not logged in' });
  }

  try {
    const result = await Comments.destroy({
      where: {
        id,
      },
    });

    if (result === 1) {
      return res.json({ message: 'delete comment success' });
    } else {
      return res.status(503).json({ message: 'delete comment fail' });
    }
  } catch (error) {
    console.log(error);
  }
};
