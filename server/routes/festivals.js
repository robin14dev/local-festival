const express = require("express");
const router = express.Router();
const controller = require('../controllers/festivals');
console.log('hreeeee');

router.get('/', controller.get);

//*테스트용



module.exports = router;