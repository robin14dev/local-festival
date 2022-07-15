const db = require("../../db/index");

module.exports = {
    delpick :{
        delete: ({id,festivalId},callback) =>{

            const queryString= `DELETE FROM pick WHERE user_id = ${id} AND festivalId =${festivalId}`

            db.query(queryString,(error)=>{
            
                callback(error)

            })
        }
    }
}