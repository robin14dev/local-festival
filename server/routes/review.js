const express = require('express')
const router = express.Router();


const getReview = require('../controllers/review/get')
const addReview = require('../controllers/review/add')
const deleteReview = require('../controllers/review/delete')

router.get('/:festivalId', getReview)
router.post('/', addReview)
router.delete('/:festivalId/:reviewId', deleteReview)

module.exports = router;