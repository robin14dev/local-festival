require('dotenv').config()

module.exports = 
{
  "development": {
    "account": "root",
    "password": process.env.DATABASE_PASSWORD,
    "database": "local_festival",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "account": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "account": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
