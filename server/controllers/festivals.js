const {Festivals} = require("../models/")
const { Op } = require("sequelize");



module.exports = {
  get : (req, res) => {
     function today(){
          let now = new Date()
          let year = now.getFullYear().toString();
          let month = now.getMonth() + 1;
          let date = now.getDate();
          if(month < 10){ month = '0'+ month} 
          if(date < 10){ date = '0'+ date} 

          return year+month+date;
        }

    let date = today()

    Festivals.findAll({
      where : {endDate : {[Op.gte] : date},
               startDate : {[Op.lte] : date}

        }
    })
    //종료날짜가 오늘 이상인 것들만
    //시작날짜가 오늘 이하인 것들만 
  
  
    .then(response => {
      res.json(response)
    })
    .catch(err => {
      console.log(err);
      res.status(500).send("Internal Server Error")
    })

  }
}