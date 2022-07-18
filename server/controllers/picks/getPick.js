const {Users, Picks} = require('../../models')
const validateToken = require('../tokenFunctions/validateToken')


module.exports = async (req, res) => {
 console.log('get pick!!');
 const accessTokenData = validateToken(req)
 if(!accessTokenData){
     return res.status(404).json({data:null , message: 'User not logged in'})
 }

const {id} = accessTokenData
let result =  await Picks.findAll({
  attributes : ['festivalId'],
  where : {'userId' : Number(id)}
})

//console.log(result[0].dataValues); // [ 2746930, 910544, 1307813 ]
//console.log(result.map(ele => ele.dataValues));
let a = result.map(ele => ele.dataValues)
res.json(a)
}