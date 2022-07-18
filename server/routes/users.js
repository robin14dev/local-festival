const express = require('express');
const router = express.Router();
const signup = require('../controllers/users/signup')
const signin = require('../controllers/users/signin');
const withdraw = require('../controllers/users/withdraw');
const auth = require('../controllers/users/auth')
const edit = require('../controllers/users/edit')

router.post('/signup', signup)
router.post('/signin', signin)
router.delete('/', withdraw)
router.get('/', auth)
router.put('/', edit)

module.exports = router;