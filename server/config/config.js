require('dotenv').config();
// console.log(process.env.DATABASE_PASSWORD);
const {
  DB_HOST_TEST,
  DB_USERNAME_TEST,
  DB_PWD_TEST,
  DB_PORT_TEST,
  DB_HOST_DEV,
  DB_USERNAME_DEV,
  DB_PWD_DEV,
  DB_PORT_DEV,
} = process.env;
module.exports = {
  development: {
    username: DB_USERNAME_DEV,
    password: DB_PWD_DEV,
    database: 'local_festival',
    host: DB_HOST_DEV,
    port: DB_PORT_DEV,
    dialect: 'mysql',
  },
  test: {
    username: DB_USERNAME_TEST,
    password: DB_PWD_TEST,
    database: 'local_festival',
    host: DB_HOST_TEST,
    dialect: 'mysql',
    port: DB_PORT_TEST,
  },
  production: {
    username: 'root',
    password: null,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
};
