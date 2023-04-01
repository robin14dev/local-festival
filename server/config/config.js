require('dotenv').config();
const {
  DB_SCHEMA_DEV,
  DB_HOST_DEV,
  DB_USERNAME_DEV,
  DB_PWD_DEV,
  DB_PORT_DEV,
  S3_GALLERY_DEV,

  DB_SCHEMA_TEST,
  DB_HOST_TEST,
  DB_USERNAME_TEST,
  DB_PWD_TEST,
  DB_PORT_TEST,
  S3_GALLERY_TEST,

  DB_SCHEMA_PROD,
  DB_HOST_PROD,
  DB_USERNAME_PROD,
  DB_PWD_PROD,
  DB_PORT_PROD,
  S3_GALLERY_PROD,

  DB_DIALECT,
} = process.env;
module.exports = {
  development: {
    database: DB_SCHEMA_DEV,
    host: DB_HOST_DEV,
    username: DB_USERNAME_DEV,
    password: DB_PWD_DEV,
    port: DB_PORT_DEV,
    dialect: DB_DIALECT,
    s3_gallery: S3_GALLERY_DEV,
  },
  test: {
    database: DB_SCHEMA_TEST,
    host: DB_HOST_TEST,
    username: DB_USERNAME_TEST,
    password: DB_PWD_TEST,
    port: DB_PORT_TEST,
    dialect: DB_DIALECT,
    s3_gallery: S3_GALLERY_TEST,
  },
  production: {
    database: DB_SCHEMA_PROD,
    host: DB_HOST_PROD,
    username: DB_USERNAME_PROD,
    password: DB_PWD_PROD,
    port: DB_PORT_PROD,
    dialect: DB_DIALECT,
    s3_gallery: S3_GALLERY_PROD,
  },
};
