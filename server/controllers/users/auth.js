const {Users} = require('../../models')
const validateToken = require('../tokenFunctions/validateToken')

module.exports = async(req, res) => {
  const accessTokenData = validateToken(req)

  if(!accessTokenData){
      return res.status(404).json({data:null , message: 'No access Token'})
  }

  const { account } = accessTokenData

  let user = await Users.findOne({where : {account}})
  const {id,  nickname} = user
  res.json({data : {user_id : id, account : account, nickname : nickname}})
}