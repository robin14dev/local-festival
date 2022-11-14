const { Users } = require('../../models');
const bcrypt = require('bcrypt');
const validateToken = require('../token-functions/validateToken');

module.exports = async (req, res) => {
  //console.log(req.body); //{ passwordCheck: 'ccccxxx' }
  console.log(validateToken);
  const accessTokenData = validateToken(req);

  if (!accessTokenData) {
    return res.status(404).json({ data: null, message: 'User not logged in' });
  }
  const { account } = accessTokenData;
  const { passwordCheck } = req.body;

  let user = await Users.findOne({ where: { account } });
  console.log('@@@@@@@@@@@', user.password);

  const { password } = user;

  bcrypt.compare(passwordCheck, password).then(async (match) => {
    if (!match) {
      res
        .status(403)
        .json({ message: 'Wrong account And Password Combination' });
    } else {
      Users.destroy({
        where: { account: account },
      }).then(() => {
        res.status(200).json({ message: 'successfully quit' });
      });
    }
  });
};
