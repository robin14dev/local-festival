const {Users} = require("../../models")
const bcrypt = require("bcrypt");
const {sign} = require('jsonwebtoken');

module.exports = async (req, res) => {
//console.log(req.body); // { account: 'a', password: 'a' }
const {account, password} = req.body

 let user = await Users.findAll({where : {  account : account }})
  //console.log('********',user);
 if(user.length === 0) {
  return res.status(409).json({message: "User Doesn't Exist" })
 } else {

   //console.log("userExist--------", user);
   const {id, account, nickname} = user[0]
   bcrypt.compare(password, user[0].password)
   .then(async(match) => {
    if(!match) {
      return res.status(401).json({ message: "Wrong account And Password Combination" })
    }

    const accessToken = sign( 
       {"account":`${account}`, "id": `${id}`},
    process.env.ACCESS_SECRET
    )
    res.json({data : {token : accessToken, userId:id, account:account, nickname : nickname},message : "login success"})

   })
 }


}