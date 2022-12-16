module.exports = (req, res) => {
  require('dotenv').config();
  // console.log(req.headers);
  const { verify } = require('jsonwebtoken');
  const validateToken = req.headers['accesstoken'];
  if (!validateToken) {
    return null;
  }

  try {
    return verify(validateToken, process.env.ACCESS_SECRET);
  } catch (err) {
    return null;
  }
};
