module.exports = (req, res) => {
  require('dotenv').config();
  const { verify } = require('jsonwebtoken');
  const validateToken =
    req.headers['accesstoken'] || req.body.headers['accesstoken'];
  if (!validateToken) {
    return null;
  }

  try {
    return verify(validateToken, process.env.ACCESS_SECRET);
  } catch (err) {
    return null;
  }
};
