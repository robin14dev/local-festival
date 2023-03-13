'use strict';
const axios = require('axios');
const { Festivals } = require('../models');
require('dotenv').config();

//*추가해야할것
//# 에러가 생기면 에러 생기기 전까지 db에 넣어놓고 에러다루게 하기
// 트래픽 초과시 에러 분기처리
// 현재 문제 : 데이터를 다 받아온 다음에 취합해서 한 배열을 만들고 난 후, sequelize에 전송
// api2 에 트래픽 초과로 배열이 만들어지가다가 끊김

// 업데이트 로직?
// 기본 : db에 festivalId가 있으면 넘어가고 없으면 데이터 넣기 시드파일 하나 더 만들어서, 조회 hasOwnproperty
// api1으로 한번 데이터 요청으로 1000개 받아오고,
// 1000개 데이터 돌리면서 sequelize find 찾아서 없으면 api2요청 보내서 저장  : db요청 1000번 보내야됨 왔다리 갔다리 1000번 해야됨

// 대안 : festivalId만 모아놓은 객체 만들어서
// hasownproperty로 접근 let only
// 조건 : 있는지 확인 할 때마다 현재 어떤 아이디들이 저장되어 있는지 데이터가 필요함
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      //#1 현재 있는 축제 id 목록 추출
      let festivalIdObj = {};
      let arr = await Festivals.findAll({ attributes: ['festivalId'] });

      arr.forEach((ele) => {
        festivalIdObj[ele.festivalId] = ele.festivalId;
      });

      /*  console.log(festivalIdObj);
          {
            '910544': 910544,
            '1307813': 1307813,
            '1806376': 1806376,
            '2628962': 2628962,
            '2704330': 2704330,
            '2733528': 2733528,
            '2746930': 2746930,
            '2747639': 2747639,
            '2759260': 2759260,
            '2819403': 2819403
          } */
      console.log('현재 DB에 저장된 축제 수', arr.length);
      //#2 api1으로 공공데이터 목록 받아오기 (한번요청)) total count : 1060

      let result = [];
      let api1 = await axios.get(
        `http://api.visitkorea.or.kr/openapi/service/rest/KorService/searchFestival?ServiceKey=${process.env.API_KEY}&eventStartDate=20170101&arrange=A&listYN=Y&numOfRows=1299&MobileOS=ETC&MobileApp=AppTesting&_type=json`
      );
      let festivalList = api1.data.response.body.items.item;
      console.log('api1 받아온 데이터 개수 : ', festivalList.length);
      //#3 받아온 1060개 배열 돌기
      for await (const ele of festivalList) {
        try {
          //#4-1 받아온 배열의 contentid가 festivalIdObj에 이미 있으면 넘어가고
          const {
            title,
            contentid,
            firstimage,
            eventstartdate,
            eventenddate,
            addr1,
            tel,
          } = ele;
          if (festivalIdObj.hasOwnProperty(contentid)) continue;
          //#4-2 없으면 obj 만들어서 추가하기
          let api2 = await axios.get(
            `http://api.visitkorea.or.kr/openapi/service/rest/KorService/detailCommon?ServiceKey=${
              process.env.API_KEY
            }&contentId=${Number(
              contentid
            )}&defaultYN=Y&overviewYN=Y&MobileOS=ETC&MobileApp=AppTesting&_type=json`
          );
          // console.log(`contentid : ${ele.contentid},  detailCommon`, api2);
          const overviewAndUrl = api2.data.response.body.items.item;
          //console.log(overviewAndUrl);
          const { homepage, overview } = overviewAndUrl[0]; // 얘가 바뀜
          const obj = {};
          obj.festivalId = contentid;
          obj.title = title;
          obj.imageUrl = firstimage;
          obj.startDate = eventstartdate;
          obj.endDate = eventenddate;
          obj.location = addr1;
          obj.tel = tel;
          (obj.createdAt = new Date()), (obj.updatedAt = new Date());
          obj.homepageUrl = homepage;
          obj.overview = overview;

          result.push(obj);
          console.log(result.length, obj.festivalId);
        } catch (error) {
          //# 4-3 에러날 경우에 에러나기 직전 데이터만 result에 넣은 채로 for문 끊기
          console.log('for문안에서 error', error);
          break;
        }
      }

      console.log('최종 결과??', result.length);
      //#5 for문 종료 후, bulkInsert하기
      await queryInterface.bulkInsert('Festivals', result, {});
    } catch (error) {
      console.log('try~catch 에러다루기 ', error);
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
