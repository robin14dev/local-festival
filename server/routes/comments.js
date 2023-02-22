const express = require('express');

const router = express.Router();
const getComment = require('../controllers/comments/get');
const addComment = require('../controllers/comments/add');
const deleteComment = require('../controllers/comments/delete');
const updateComment = require('../controllers/comments/update');

router.get('/:id', getComment);
router.post('/', addComment);
router.delete('/', deleteComment);
router.patch('/', updateComment);
module.exports = router;
