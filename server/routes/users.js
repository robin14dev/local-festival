const express = require('express');
const router = express.Router();
const signup = require('../controllers/users/signup')
const signin = require('../controllers/users/signin');
const withdraw = require('../controllers/users/withdraw');
const auth = require('../controllers/users/auth')
const edit = require('../controllers/users/edit')
const editPassword = require('../controllers/users/editPassword')
const editTracked = require('../controllers/users/editTracked')
router.post('/signup', signup)
router.post('/signin', signin)
router.delete('/', withdraw)
router.get('/', auth)
router.get('/edit', editTracked)
router.put('/nickname', edit)
router.put('/password', editPassword)

module.exports = router;