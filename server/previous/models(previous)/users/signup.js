const db = require("../../db/index");

module.exports = {
  signup :{
    post: (newUser,callback) =>{

      const {account,password,nickname} = newUser
      const queryString= `select account from users where account = "${account}"`

      db.query(queryString,(error,result)=>{
        
        if(error){

          return callback(error)

        } else if(result.length!==0){
          
          return callback(error,result)
          
        } else{
          
          const queryString="INSERT INTO users (account,password,nickname) VAlUES (?,?,?) "
          
          const params = [account,password,nickname]
          
          db.query(queryString, params, (error, result) => {
            callback(error, result);
          });
          
        }
      })
    }
  }
};