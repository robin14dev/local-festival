require('dotenv').config()
const {verify} =require('jsonwebtoken')


module.exports = (req, res) => {
    
  const validateToken = req.headers["accesstoken"]
  //console.log(validateToken);
  if(!validateToken){
      return null
  }

  try{
      return verify(validateToken, process.env.ACCESS_SECRET)
  } catch(err){
      return null
  }
}
 
