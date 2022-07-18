const db = require("../../db/index");

module.exports = {
    addpick :{
        post: ({id,festivalId},callback) =>{

            const queryString= "INSERT INTO pick (userId,festivalId) VAlUES (?,?)"

            const params = [id,festivalId]

            db.query(queryString,params,(error)=>{
            
                callback(error)

            })
        }
    }
}