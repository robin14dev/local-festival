const models  = require('../../models/users/signin');
const bcrypt = require("bcrypt");
const {sign} = require('jsonwebtoken');

module.exports= { 
    signin : {
        post : (req, res) => {
            const { account, password } = req.body;
            
            models.signin.post(account,(error,result) =>{

                if(error){
                    res.status(500).json({message :'Internal Server Error'});
                } else if(result.length===0){
                    res.status(409).json({ message: "User Doesn't Exist" })
                    
                }
                else{
                    const {id, account,nickname } = result[0]
                    bcrypt.compare(password,result[0].password)
                        .then(async(match) => {
                            if(!match){
                                return res.status(401).json({ message: "Wrong account And Password Combination" })
                            }
        
                            const accessToken = sign(
                                {"account":`${account}`, "id": `${id}`},
                                process.env.ACCESS_SECRET
                            )
        
                            res.json({data : {token : accessToken, user_id:id, account:account, nickname : nickname},message : "login success"})
                        })
                }
            })
        }
    }
}