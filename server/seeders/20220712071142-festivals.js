'use strict';
const axios = require("axios")
require('dotenv').config()


module.exports = {
  async up (queryInterface, Sequelize) {
   
    let result= []

    let api1 = await axios.get(`http://api.visitkorea.or.kr/openapi/service/rest/KorService/searchFestival?serviceKey=${process.env.API_KEY}&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&arrange=A&listYN=Y&eventStartDate=20170901`)
    let festivalList = api1.data.response.body.items.item
    console.log(festivalList);
    //let newArr = []
 /*    //* 배열 하나만 있을 때는 성공, promise 문제가 아닌 것 같음
    let fest1 = api1.data.response.body.items.item[0]
    const {title, contentid, firstimage, eventstartdate, eventenddate, addr1, tel} = fest1
    const obj = {}
      obj.festivalId = contentid
      obj.title = title
      obj.imageUrl = firstimage
      obj.startDate = eventstartdate
      obj.endDate = eventenddate
      obj.location = addr1  
      obj.tel = tel  
      obj.createdAt = new Date(),
      obj.updatedAt = new Date() 

      let response = await axios.get(`http://api.visitkorea.or.kr/openapi/service/rest/KorService/detailCommon?ServiceKey=f%2BC4ATDfnw7CjWc5gzEPF7fTHp9fbFfoE%2FHqps98KoNO6C11na0Y6J0AECxjby%2BgMGSc5%2B1ZK3gY6phsKHKiEQ%3D%3D&contentId=${fest1.contentid}&defaultYN=Y&overviewYN=Y&MobileOS=ETC&MobileApp=AppTesting`)
    
        const overviewAndUrl = response.data.response.body.items.item
        const {homepage, overview} = overviewAndUrl
     
        obj.homepageUrl = homepage
        obj.overview = overview
        newArr.push(obj)
        console.log(newArr); */
  
    //# 성공 코드
        for await (const ele of festivalList) {
          const {title, contentid, firstimage, eventstartdate, eventenddate, addr1, tel} = ele
      const obj = {}
      obj.festivalId = contentid
      obj.title = title
      obj.imageUrl = firstimage
      obj.startDate = eventstartdate
      obj.endDate = eventenddate
      obj.location = addr1  
      obj.tel = tel  
      obj.createdAt = new Date(),
      obj.updatedAt = new Date() 
     let response = await axios.get(`http://api.visitkorea.or.kr/openapi/service/rest/KorService/detailCommon?ServiceKey=${process.env.API_KEY}&contentId=${ele.contentid}&defaultYN=Y&overviewYN=Y&MobileOS=ETC&MobileApp=AppTesting`)
    console.log(response);
        const overviewAndUrl = response.data.response.body.items.item
        const {homepage, overview} = overviewAndUrl
     
        obj.homepageUrl = homepage
        obj.overview = overview
        result.push(obj)
          console.log(result.lengt);
        }
   
    //# 실패코드
//         festivalList.map(async (ele) => {
//       const {title, contentid, firstimage, eventstartdate, eventenddate, addr1, tel} = ele
//       const obj = {}
//       obj.festivalId = contentid
//       obj.title = title
//       obj.imageUrl = firstimage
//       obj.startDate = eventstartdate
//       obj.endDate = eventenddate
//       obj.location = addr1  
//       obj.tel = tel  
//       obj.createdAt = new Date(),
//       obj.updatedAt = new Date() 
//      let response = await axios.get(`http://api.visitkorea.or.kr/openapi/service/rest/KorService/detailCommon?ServiceKey=f%2BC4ATDfnw7CjWc5gzEPF7fTHp9fbFfoE%2FHqps98KoNO6C11na0Y6J0AECxjby%2BgMGSc5%2B1ZK3gY6phsKHKiEQ%3D%3D&contentId=${ele.contentid}&defaultYN=Y&overviewYN=Y&MobileOS=ETC&MobileApp=AppTesting`)
    
//         const overviewAndUrl = response.data.response.body.items.item
//         const {homepage, overview} = overviewAndUrl
     
//         obj.homepageUrl = homepage
//         obj.overview = overview
//         result.push(obj)
// })

// let aa = [
//   {festivalId : 7,
//   title:"33",
// imageUrl : "33",
// startDate : "33",
// endDate : "dd",
// location : "ss",
// tel : "dd",
// overview : "dd",
// homepageUrl : "ff",
// createdAt : new Date(),
// updatedAt : new Date()}
// ]
console.log('---------------',result);
await queryInterface.bulkInsert('Festivals', result,{})

     

  
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
