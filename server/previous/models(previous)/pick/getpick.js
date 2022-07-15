const db = require("../../db/index");

module.exports = {
    getpick :{
        get: (id,callback) =>{

            const queryString= `SELECT festivalId FROM pick where user_id = ${id}`

            db.query(queryString,(error,result)=>{
            
                callback(error,result)

            })
        }
    }
}