const express = require('express');

const router = express.Router();
const getComment = require('../controllers/comments/get');
const addComment = require('../controllers/comments/add');

router.get('/:id', getComment);
router.post('/', addComment);

module.exports = router;
