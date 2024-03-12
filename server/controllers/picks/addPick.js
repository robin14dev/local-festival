const { Picks } = require("../../models");
const validateToken = require("../token-functions/validateToken");
module.exports = async (req, res) => {
  try {
    const accessTokenData = validateToken(req);

    if (!accessTokenData) {
      return res
        .status(401)
        .json({ data: null, message: "User not logged in" });
    }

    const userId = accessTokenData.id;

    const { festivalId } = req.body; // { festivalId: 2819403 }
    await Picks.create({ userId, festivalId });
    res.json({ message: "add pick success" });
    return;
  } catch (error) {
    console.log(error);
    return res.status(503);
  }
};
