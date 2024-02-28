const { Reviews } = require("../../models");
const validateToken = require("../token-functions/validateToken");

module.exports = async (req, res) => {
  console.log("delete------------", req.params); // { festivalId: '1307813' }
  const { festivalId, id } = req.params;

  const accessTokenData = validateToken(req);

  if (!accessTokenData) {
    return res.status(404).json({ data: null, message: "User not logged in" });
  }

  const userId = accessTokenData.id;

  let result = await Reviews.destroy({
    where: {
      festivalId,
      userId,
      id,
    },
  });
  console.log(result);

  try {
    if (result === 1) {
      return res.json({ message: "delete review success" });
    } else {
      return res.status(503).json({ message: "delete review fail" });
    }
  } catch (error) {
    // throw new Error('delete review fail');
    return res.json({ message: "delete review fail" });
  }

  //삭제시 필요 : userId(token에 실려옴), festivalId(얘로 수정)
};
