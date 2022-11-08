console.log('validateToken!!!');

module.exports = (req, res) => {
  require('dotenv').config();
  const { verify } = require('jsonwebtoken');
  const validateToken = req.headers['accesstoken'];
  //console.log(validateToken);
  if (!validateToken) {
    return null;
  }

  try {
    return verify(validateToken, process.env.ACCESS_SECRET);
  } catch (err) {
    return null;
  }
};
