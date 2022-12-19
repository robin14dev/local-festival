const express = require('express');
const router = express.Router();
const dotenv = require('dotenv')


const festivalRouter = require('./festivals');
const usersRouter = require('./users');
const pickRouter = require('./pick')
const reviewRouter = require('./review')

router.use('/festivals', festivalRouter);
router.use('/users', usersRouter);
router.use('/pick', pickRouter)
router.use('/review', reviewRouter)

module.exports = router;
