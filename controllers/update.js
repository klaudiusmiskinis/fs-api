const { connection, mysql, util } = require("../services/db");

/**
 * Updates name where id matches.
 */
module.exports.updateNameById = updateNameById = async (idFile, newName) => {
  const conn = mysql.createConnection(connection);
  try {
    const query = util.promisify(conn.query).bind(conn);
    const string = mysql
      .format("UPDATE files SET name = ? WHERE id = ?", [newName, idFile])
      .split("''")
      .join("'");
    return await query(string);
  } finally {
    conn.end();
  }
};

/**
 * Upadtes version where id matches.
 */
module.exports.updateVersionById = updateVersionById = async (idFile) => {
  const conn = mysql.createConnection(connection);
  try {
    const query = util.promisify(conn.query).bind(conn);
    const string = mysql
      .format("UPDATE files SET isLastVersion = 0 WHERE id = ?", [idFile])
      .split("''")
      .join("'");
    return await query(string);
  } finally {
    conn.end();
  }
};

/**
 * Updates removed, removed_date and version where id matches.
 */
module.exports.updateDeletedAndDateById = updateDeletedAndDateById = async (
  date,
  idFile
) => {
  const conn = mysql.createConnection(connection);
  try {
    const query = util.promisify(conn.query).bind(conn);
    const string = mysql
      .format(
        "UPDATE files SET isRemoved = 1, removed_date = ?, isLastVersion = 0 WHERE id = ?",
        [date, idFile]
      )
      .split("''")
      .join("'");
    return await query(string);
  } finally {
    conn.end();
  }
};
