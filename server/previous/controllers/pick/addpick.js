const models  = require('../../models/pick/addpick');
const {validateToken} = require('../../controllers/tokenfunctions/validateToken');

module.exports= {
    addpick : {
        post : async(req,res) => {
            const accessTokenData = validateToken(req)
            if(!accessTokenData){
                return res.status(404).json({data:null , message: 'User not logged in'})
            }

            const {id} = accessTokenData

            const {festivalId} = req.body

            // pick table에 account 와 festivalId 데이터 삽입
            models.addpick.post({id,festivalId},(error)=>{
                if(error){
                    res.status(500).json({message :'Internal Server Error'});
                } else{
                    res.status(201).json({message:'pick ok'})
                }
            })
        }
    }
}
