const db = require("../../db/index");

module.exports = {
    delpick :{
        delete: ({id,festivalId},callback) =>{

            const queryString= `DELETE FROM pick WHERE userId = ${id} AND festivalId =${festivalId}`

            db.query(queryString,(error)=>{
            
                callback(error)

            })
        }
    }
}