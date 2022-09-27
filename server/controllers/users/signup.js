const bcrypt = require('bcrypt');
const { Users } = require('../../models');

module.exports = async (req, res) => {
  console.log(req.body);
  const { account, password, nickname } = req.body; // { account: 'a', password: 'aaaa', nickname: 'a' }
  if (!account || !password || !nickname) {
    return res.status(400).send('Unauthorized user');
  }

  let isUser = await Users.findAll({ where: { account: account } });
  if (isUser.length !== 0) {
    return res.status(409).send('Already user signed up');
  }

  bcrypt
    .hash(password, 10)
    .then((hash) => {
      const newUser = {
        account: account,
        password: hash,
        nickname: nickname,
      };

      Users.create(newUser).then(res.send('created'));
    })
    .catch((err) => {
      console.log(err);
    });
};
