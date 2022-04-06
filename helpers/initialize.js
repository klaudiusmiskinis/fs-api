const { Sequelize } = require("sequelize");
const { connection } = require("../config/db");
require("dotenv").config();

const db = {};
module.exports = {
  db: db,
};

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
  db.File = require("../models/file")(sequelize);
  // await sequelize.sync();
}
