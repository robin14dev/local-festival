const { Users } = require('../../models');
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');

module.exports = async (req, res) => {
  const { account, password } = req.body;

  let user = await Users.findAll({ where: { account: account } });
  if (user.length === 0) {
    return res.status(409).json({ message: "User Doesn't Exist" });
  } else {
    //console.log("userExist--------", user);
    const { id, account, nickname, defaultPic } = user[0];
    bcrypt.compare(password, user[0].password).then(async (match) => {
      if (!match) {
        return res
          .status(401)
          .json({ message: 'Wrong account And Password Combination' });
      }

      const accessToken = sign(
        { account: `${account}`, id: `${id}` },
        process.env.ACCESS_SECRET
      );
      res.json({
        info: {
          token: accessToken,
          userId: id,
          account,
          nickname,
          defaultPic,
        },
        message: 'login success',
      });
    });
  }
};
