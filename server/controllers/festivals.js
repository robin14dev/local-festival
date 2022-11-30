const { Festivals, Users, Reviews, Picks, sequelize } = require('../models/');
const { Op } = require('sequelize');

module.exports = {
  festivals: async (req, res) => {
    // 받을 변수 : offset
    console.log(req.query); //{ offset: '10' }
    const { limit, offset, query } = req.query;

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

    const tagsArr = [
      {
        text: '가을꽃축제',
        query: ['가을', '꽃', '핑크', '플라워', '국화'],
      },
      {
        text: '불빛축제',
        query: ['라이팅', '드론', '별빛', '불빛', '달빛'],
      },
      {
        text: '역사탐방',
        query: ['민속', '수문장', '근현대사', '화성'],
      },
      { text: '할로윈축제', query: ['호러', '할로윈'] },
    ];

    function tagCheck(query) {
      for (const tag of tagsArr) {
        if (tag['text'] === query) {
          return tag['query'];
        }
      }
      return false;
    }

    let isTag = tagCheck(query);
    if (isTag) {
      try {
        let total = [];
        for await (const item of isTag) {
          let festivals = await Festivals.findAll({
            where: {
              [Op.and]: [
                {
                  endDate: { [Op.gte]: date },
                  startDate: { [Op.lte]: date },
                },

                {
                  [Op.or]: [
                    {
                      title: {
                        [Op.like]: '%' + item + '%',
                      },
                    },
                    {
                      location: {
                        [Op.like]: '%' + item + '%',
                      },
                    },
                    {
                      overview: {
                        [Op.like]: '%' + item + '%',
                      },
                    },
                  ],
                },
              ],
            },

            limit: Number(limit),
            offset: Number(offset),
          });

          total = total.concat(festivals);
        }

        let filtered = total.filter((item, i) => {
          return (
            total.findIndex((item2, j) => {
              return item.festivalId === item2.festivalId;
            }) === i
          );
        });
        return res.json(filtered);
      } catch (error) {
        console.log(error);
      }
    }

    if (query) {
      try {
        let festivals = await Festivals.findAll({
          where: {
            [Op.and]: [
              {
                endDate: { [Op.gte]: date },
                startDate: { [Op.lte]: date },
              },

              {
                [Op.or]: [
                  {
                    title: {
                      [Op.like]: '%' + query + '%',
                    },
                  },
                  {
                    location: {
                      [Op.like]: '%' + query + '%',
                    },
                  },
                  {
                    overview: {
                      [Op.like]: '%' + query + '%',
                    },
                  },
                ],
              },
            ],
          },

          limit: Number(limit),
          offset: Number(offset),
        });

        return res.json(festivals);
      } catch (error) {
        console.log(error);
      }
    }

    try {
      let festivals = await Festivals.findAll({
        where: {
          endDate: { [Op.gte]: date },
          startDate: { [Op.lte]: date },
        },

        limit: Number(limit),
        offset: Number(offset),
      });
      res.json(festivals);
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  },
  festival: async (req, res) => {
    const userId = Number(req.query.userId);
    const festivalId = Number(req.params.festivalId);
    console.log(req.query);

    try {
      let festival = await Festivals.findOne({
        where: { festivalId },
      });

      //리뷰개수

      const reviewCount = await Reviews.count({
        where: {
          festivalId,
        },
      });
      //해당 축제 유저가 픽했는지 아닌지

      let isPicked = await Picks.count({
        where: {
          [Op.and]: [{ festivalId }, { userId }],
        },
      });

      isPicked = isPicked === 1 ? true : false;
      //별점 평균
      const sum = await Reviews.sum('rating', { where: { festivalId } });
      let average = 0;

      if (reviewCount !== 0) {
        average = Number((sum / reviewCount).toFixed(1));
      }
      //좋아요개수
      const likes = await Picks.count({
        where: { festivalId },
      });

      //최고리뷰, 최저리뷰
      const ratingMin = `select R.id, R.content, R.rating, R.updatedAt, R.festivalId, U.nickname FROM Reviews as R  INNER JOIN Users as U on R.userId = U.id where R.festivalId = ${festivalId} order by  rating asc, updatedAt desc limit 1 ;`;
      const ratingMax = `select R.id, R.content, R.rating, R.updatedAt, R.festivalId, U.nickname FROM Reviews as R  INNER JOIN Users as U on R.userId = U.id where R.festivalId = ${festivalId} order by rating desc ,updatedAt desc limit 1 ;`;

      let badReview = await sequelize.query(ratingMin, {
        type: sequelize.QueryTypes.SELECT,
      });

      let goodReview = await sequelize.query(ratingMax, {
        type: sequelize.QueryTypes.SELECT,
      });
      res.json({
        festival,
        likes,
        average,
        badReview,
        goodReview,
        reviewCount,
        isPicked,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
