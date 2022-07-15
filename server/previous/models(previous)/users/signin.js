const db = require("../../db/index");

module.exports = {
    signin :{
        post: (account,callback) =>{
 
        const queryString= `select * from users where account = "${account}"`

        db.query(queryString,(error,result)=>{

            callback(error,result)
            }
        )
    }
  }
};