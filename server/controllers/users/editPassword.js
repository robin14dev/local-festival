const {Users} = require('../../models')
const validateToken = require('../tokenFunctions/validateToken')
const bcrypt = require("bcrypt");

module.exports = async (req, res) => {
  console.log('rerereererererere');
  const accessTokenData = validateToken(req)
  if(!accessTokenData){
      return res.status(404).json({data:null , message: 'User not logged in'})
  }

  console.log(req.body);
  const {currentPassword,newPassword,passwordCheck} = req.body
  const {id, account} = accessTokenData

  let user = await Users.findOne({where : {id}})
  console.log(user.password);

  bcrypt.compare(currentPassword, user.password)
   .then(async(match) => {
    if(!match) {
      return res.status(401).json({ message: "Wrong Password" })
    }

   bcrypt.hash(newPassword, 10)
   .then(hash => {
   return Users.update({password : hash}, {where : {id}})
   })
   .then(async(response)=> {
    console.log(response);
    console.log("비번 변경 성공");
    let result =  await Users.findOne({attributes : ['updatedAt']}, {where : id})
    console.log(result.updatedAt);
    res.json({updatedAt : result.updatedAt, message : "password successfully changed" })
   })
   .catch(err => {
    console.log(err);
   })
  })

}