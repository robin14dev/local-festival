const {Reviews, Users} = require('../../models')

module.exports = async(req, res) => {
 // console.log('req.params-----------',req.params);

  const {festivalId} = req.params //  { festivalId: '1307813' }

  let result = await  Reviews.findAll({
    include: [{
      model: Users,
      attributes: ['nickname']
    }],
     where : {festivalId},
     
  
  })
  //console.log(result);
  res.json(result)

}