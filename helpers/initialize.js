const { Sequelize } = require("sequelize");
const { connection } = require("../config/db");

initialize();

async function initialize() {
  const sequelize = new Sequelize(
    connection.database,
    connection.user,
    connection.password,
    {
      dialect: "mysql",
    }
  );
  module.exports.File = require("../models/file")(sequelize);
}
