const express = require('express');
const router = express.Router();
const signup = require('../controllers/users/signup');
const signin = require('../controllers/users/signin');
const withdraw = require('../controllers/users/withdraw');
const auth = require('../controllers/users/auth');
const edit = require('../controllers/users/edit');
const editPassword = require('../controllers/users/editPassword');
const editTracked = require('../controllers/users/editTracked');
const defaultPic = require('../controllers/users/defaultPic');

const validateToken = require('../controllers/token-functions/validateToken');

const { config } = require('../models/index.js');

const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  region: 'ap-northeast-2',
});

const uploadS3 = multer({
  storage: multerS3({
    s3,
    bucket: config.s3_gallery,
    key(req, file, cb) {
      cb(null, `users/${req.userId}/profile/${file.originalname}`);
    },
  }),
  limits: { fieldSize: 25 * 1024 * 1024 },
});

const deleteS3 = async (req, res, next) => {
  try {
    const urlKey = req.body.urlKey;
    await s3.send(
      new DeleteObjectCommand({
        Bucket: config.s3_gallery,
        Key: urlKey,
      })
    );
    next();
  } catch (err) {
    console.log('Error', err);
    return res.status(500).send('Internal Server Error');
  }
};

function validate(req, res, next) {
  const accessTokenData = validateToken(req);

  if (!accessTokenData) {
    return res.status(401).json({ data: null, message: 'User not logged in' });
  }

  const userId = accessTokenData.id;
  req.userId = Number(userId);
  next();
}

router.post('/signup', signup.signup);
router.get('/signup', signup.validate);
router.post('/signin', signin);
router.delete('/', withdraw);
router.get('/', auth);
router.get('/edit', editTracked);
router.put('/nickname', edit);
router.put('/password', editPassword);
router.post(
  '/defaultPic',
  validate,
  uploadS3.single('file'),
  defaultPic.upload
);
router.delete('/defaultPic', validate, deleteS3, defaultPic.delete);
module.exports = router;
