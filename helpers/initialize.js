const { Sequelize } = require("sequelize");
const { connection, connection } = require("../config/db");
require("dotenv").config();

module.exports = db = {};

initialize();

async function initialize() {
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
  const sequelize = new Sequelize(database, user, password, {
    dialect: "mysql",
  });
  db.User = require("../users/user.model")(sequelize);
  await sequelize.sync({ alter: true });
}
