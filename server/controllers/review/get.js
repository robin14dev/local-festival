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
    const average = Number((reviewSum / count).toFixed(1));
    console.log(rows);
    //최고값을 가진 것 중에서 제일 최신의 축제

    res.json({ count, rows, average });
  } catch (error) {
    console.log(error);
  }
};
