const {Users} = require('../../models')
const validateToken = require('../tokenFunctions/validateToken')

module.exports = async(req, res) => {


  const accessTokenData = validateToken(req)
 

  try {
    if(!accessTokenData){
      return res.status(404).json({data:null , message: 'User not logged in'})
  }

    const {id, account} = accessTokenData

  let result =  await Users.findOne({attributes : ['updatedAt']}, {where : id})
  res.json({updatedAt : result.updatedAt})
    
  } catch (error) {
    console.log(error);
  }

  
}