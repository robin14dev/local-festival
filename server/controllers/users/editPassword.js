const { Users } = require("../../models");
const validateToken = require("../token-functions/validateToken");
const bcrypt = require("bcrypt");

module.exports = async (req, res) => {
  const accessTokenData = validateToken(req);
  if (!accessTokenData) {
    return res.status(404).json({ data: null, message: "User not logged in" });
  }

  console.log(req.body);
  const { currentPassword, newPassword, passwordCheck } = req.body;
  const { id, account } = accessTokenData;

  let user = await Users.findOne({ where: { id } });

  try {
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) throw new Error("Wrong Password");
    if (currentPassword === newPassword)
      throw new Error("same as the current password");
    const hashed = await bcrypt.hash(newPassword, 10);
    await Users.update({ password: hashed }, { where: { id } });
    const userInfo = await Users.findOne({ where: { id } });
    return res.json({
      updatedAt: userInfo.updatedAt,
      message: "password successfully changed",
    });
  } catch (error) {
    console.log(error);
    if (error.message === "Wrong Password") {
      return res.status(401).json({ message: "Wrong Password" });
    }
    if (error.message === "same as the current password") {
      return res.status(422).json({
        message: "New password cannot be the same as the current password",
      });
    }
  }
};
