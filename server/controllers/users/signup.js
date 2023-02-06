const bcrypt = require('bcrypt');
const { Users } = require('../../models');

module.exports = {
  signup: async (req, res) => {
    console.log(req.body);
    const { account, password, nickname } = req.body; // { account: 'a', password: 'aaaa', nickname: 'a' }
    if (!account || !password || !nickname) {
      return res.status(400).send('Unauthorized user');
    }

    let isUser = await Users.findAll({ where: { account: account } });
    if (isUser.length !== 0) {
      return res.status(409).send('Already user signed up');
    }

    try {
      // 입력 값들이 다 오지 않았을 때
      // 서버가 에러났을 때
      const hash = await bcrypt.hash(password, 10);
      const newUser = { account, password: hash, nickname };
      await Users.create(newUser);
      // return res.status(500).send('server error');

      res.send('created');
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  validate: async (req, res) => {
    console.log(req.query, 'here!!');

    const checkColumn = req.query; // {account : seef}
    const checkKey = Object.keys(checkColumn)[0];
    const checkValue = Object.values(checkColumn)[0];

    let isValid = await Users.findAll({ where: { [checkKey]: checkValue } });
    console.log(isValid);
    if (isValid.length !== 0) {
      return res.status(409).send(`Already ${checkKey}`);
    }
    return res.status(200).send(`possible ${checkKey}`);
  },
};
