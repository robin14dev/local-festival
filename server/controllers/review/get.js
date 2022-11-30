const { Reviews, Users, sequelize } = require('../../models');

module.exports = async (req, res) => {
  // console.log('review : req.params-----------', req.params);
  // console.log(req.query); // { limit: '5', offset: '0' }
  const { limit, offset } = req.query;
  const { festivalId } = req.params; //  { festivalId: '1307813' }

  try {
    const { count, rows } = await Reviews.findAndCountAll({
      include: [
        {
          model: Users,
          attributes: ['nickname'],
        },
      ],
      where: { festivalId },
      order: [['createdAt', 'DESC']],
      offset: Number(offset),
      limit: Number(limit),
    });

    // 특정 축제 평균평점
    const reviewSum = await Reviews.sum('rating', { where: { festivalId } });
    let average = 0;
    if (count !== 0) {
      average = Number((reviewSum / count).toFixed(1));
    }

    res.json({ count, rows, average });
  } catch (error) {
    console.log(error);
  }
};
