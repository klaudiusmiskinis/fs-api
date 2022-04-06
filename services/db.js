require("dotenv").config();
module.exports.util = require("util");
module.exports.mysql = require("mysql2");
module.exports.connection = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PWD,
  database: process.env.MYSQL_DB,
};
