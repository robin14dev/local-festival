const { Reviews } = require('../../models');
const validateToken = require('../token-functions/validateToken');

module.exports = async (req, res) => {
  const accessTokenData = validateToken(req);

  if (!accessTokenData) {
    return res.status(404).json({ data: null, message: 'User not logged in' });
  }

  //console.log(req.body); { data: { content: 'ㄹㄷㄹㄷ', rating: 3, festivalId: 4 } }
  //console.log('req.body.data------------',req.body.data);
  const { content, rating, festivalId } = req.body.data;
  const userId = accessTokenData.id;

  let addResult = await Reviews.create({ content, rating, festivalId, userId });
  //console.log(addResult);
  //방금 추가한 것만 보내주기
  // let result = await  Reviews.findAll({
  //   include: [{
  //     model: Users,
  //     attributes: ['nickname']
  //   }],
  //    where : {festivalId},

  // })
  res.json(addResult);
  //console.log('addReview result============',result);
};
