const db = require("../../db/index");

module.exports = {
    auth :{
        get: (account,callback) =>{

            const queryString= `SELECT * FROM users where account = "${account}"`

            db.query(queryString,(error,result)=>{
            
                callback(error,result)

            })
        }
    }
}