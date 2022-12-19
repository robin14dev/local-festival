const { Picks } = require('../../models');
const validateToken = require('../token-functions/validateToken');
const { Op } = require('sequelize');

module.exports = async (req, res) => {
  console.log('deletepick!!!!');
  console.log(req.body); //{ festivalId: 2628962 }
  const { festivalId } = req.body;
  const accessTokenData = validateToken(req);

  if (!accessTokenData) {
    return res.status(404).json({ data: null, message: 'User not logged in' });
  }

  // 특정 userId의 특정 festivalId만 지우기

  try {
    let result = await Picks.destroy({
      where: {
        userId: { [Op.eq]: accessTokenData.id },
        festivalId: { [Op.eq]: festivalId },
      },
    });

    if (result === 1) {
      return res.json({ message: 'delete success' });
    } else {
      throw new Error('');
    }

    console.log(result);
  } catch (error) {
    console.log(error);
    return res.status(503);
  }
};
