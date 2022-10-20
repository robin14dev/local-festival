const { Reviews, Users } = require('../../models');

module.exports = async (req, res) => {
  console.log('review : req.params-----------', req.params);
  console.log(req.query); // { limit: '5', offset: '0' }
  const { limit, offset } = req.query;
  const { festivalId } = req.params; //  { festivalId: '1307813' }

  try {
    // let result = await Reviews.findAll({
    //   include: [
    //     {
    //       model: Users,
    //       attributes: ['nickname'],
    //     },
    //   ],
    //   where: { festivalId },
    //   limit: Number(limit),
    //   offset: Number(offset),
    // });
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
    console.log(count);
    console.log(rows);

    res.json({ count, rows });
    //console.log(result);
  } catch (error) {
    console.log(error);
  }
};
