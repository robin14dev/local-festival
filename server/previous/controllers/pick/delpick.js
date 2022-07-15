const models  = require('../../models/pick/delpick');
const {validateToken} = require('../../controllers/tokenfunctions/validateToken');

module.exports= {
    delpick : {
        delete : (req,res) => {
            const accessTokenData = validateToken(req)
            if(!accessTokenData){
                return res.status(404).json({data:null , message: 'User not logged in'})
            }

            const {id} = accessTokenData

            const {festivalId} = req.body

            // pick table에 id 와 festivalId 데이터 삭제
            models.delpick.delete({id,festivalId},(error)=>{
                if(error){
                    res.status(500).json({message :'Internal Server Error'});
                } else{
                    res.status(201).json({message:'pick delete'})
                }
            })
        }
    }
}