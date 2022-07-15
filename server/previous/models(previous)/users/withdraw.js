const db = require("../../db/index");

module.exports = {
    withdraw :{
        get: (account,callback) =>{

            const queryString= `select password from users where account = "${account}"`

            db.query(queryString,(error,result)=>{
            
                callback(error,result)

            })
        },
        delete:(account,callback) =>{
            
            const queryString= `DELETE FROM users WHERE account="${account}"`

            db.query(queryString,(error,result)=>{
                callback(error,result)
            })
        }
    }
}