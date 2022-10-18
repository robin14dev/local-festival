const { Festivals } = require('../models/');
const { Op } = require('sequelize');

module.exports = {
  festivals: async (req, res) => {
    // 받을 변수 : offset
    console.log(req.query); //{ offset: '10' }
    let { limit, offset } = req.query;

    if (!offset) offset = 0;
    function today() {
      let now = new Date();
      let year = now.getFullYear().toString();
      let month = now.getMonth() + 1;
      let date = now.getDate();
      if (month < 10) {
        month = '0' + month;
      }
      if (date < 10) {
        date = '0' + date;
      }

      return year + month + date;
    }

    let date = today();

    try {
      let festivals = await Festivals.findAll({
        where: { endDate: { [Op.gte]: date }, startDate: { [Op.lte]: date } },
        limit: Number(limit),
        offset: Number(offset),
      });
      console.log(festivals);
      res.json(festivals);
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  },
  festival: async (req, res) => {
    console.log('festival!!!');
    console.log(Number(req.params.festivalId));

    try {
      let festival = await Festivals.findOne({
        where: { FestivalId: Number(req.params.festivalId) },
      });
      console.log('what hte festival', festival);

      res.json(festival);
    } catch (error) {
      console.log(error);
    }
  },
};
