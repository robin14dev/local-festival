var request = require("request");
const dotenv = require("dotenv");
const config = require("./config/config");
dotenv.config();

const mysql = require("mysql");

const connection = mysql.createConnection(
  config[process.env.NODE_ENV || "development"]
);
function addslashes(string) {
  if (string) {
    return string
      .replace(/\\/g, "\\\\")
      .replace(/\u0008/g, "\\b")
      .replace(/\t/g, "\\t")
      .replace(/\n/g, "\\n")
      .replace(/\f/g, "\\f")
      .replace(/\r/g, "\\r")
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"');
  } else {
    return;
  }
}
// mysql festival_api_first festivalId를 조회해서 console.log로 찍어본다.
const queryString = `SELECT festivalId from festival_api_first`;
connection.query(queryString, (err, result) => {
  result.map((el) => {
    var options = {
      method: "GET",
      url: `http://api.visitkorea.or.kr/openapi/service/rest/KorService/detailCommon?serviceKey=GF0Lq9LWPlZV7Ga1tMaCqZDhb06lzroW4fwEwQy9BfDy82xa3bPReEfNfTUBi%2Fg4mCd%2FPfHGZu1Djjs4VdP0iQ%3D%3D&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&contentId=${el.festivalId}&defaultYN=Y&firstImageYN=Y&areacodeYN=Y&catcodeYN=Y&addrinfoYN=Y&mapinfoYN=Y&overviewYN=Y&_type=json`,
      headers: {},
    };
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      let info = JSON.parse(body);
      let overview = addslashes(
        info["response"]["body"]["items"]["item"]["overview"]
      );
      let url = addslashes(
        info["response"]["body"]["items"]["item"]["homepage"]
      );
      connection.query(
        `INSERT INTO festival_api_second (festivalId,overview, url) VALUES ("${el.festivalId}", "${overview}", "${url}")`,
        (error, rows, fields) => {
          if (error) throw error;
        }
      );
    });
  });
});

// var options = {
//   method: "GET",
//   url: "http://api.visitkorea.or.kr/openapi/service/rest/KorService/detailCommon?serviceKey=stO4X3mcQKt4qoziL2sU1zxc2WkmZ3hmKg6wA6Ofi50vDavjqwvTCBPasarXjMPuRaUXMy0S1ERW8HX6KVOuFQ%3D%3D&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&contentId=${contentid}&defaultYN=Y&firstImageYN=Y&areacodeYN=Y&catcodeYN=Y&addrinfoYN=Y&mapinfoYN=Y&overviewYN=Y&_type=json",
//   headers: {},
// };
