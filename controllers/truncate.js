const { connection, mysql, util } = require("../services/db");

/**
 * Truncates the table given by a parameter.
 */
module.exports.truncateTable = truncateTable = async (table) => {
  const conn = mysql.createConnection(connection);
  try {
    const query = util.promisify(conn.query).bind(conn);
    const string = mysql
      .format("TRUNCATE TABLE ?", [table])
      .split("'")
      .join("");
    return await query(string);
  } finally {
    conn.end();
  }
};
