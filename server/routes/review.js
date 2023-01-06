const express = require('express');
const router = express.Router();

const getReview = require('../controllers/review/get');
const addReview = require('../controllers/review/add');
const deleteReview = require('../controllers/review/delete');
const updateReview = require('../controllers/review/update');

router.get('/:festivalId', getReview);
router.post('/', addReview);
router.delete('/:festivalId/:reviewId', deleteReview);
router.put('/', updateReview);

module.exports = router;
