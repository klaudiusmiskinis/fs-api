const { connection, mysql, util } = require("../services/db");

/**
 * Selects all the files from files.
 */
module.exports.selectAll = selectAll = async () => {
  const conn = mysql.createConnection(connection);
  try {
    const query = util.promisify(conn.query).bind(conn);
    return await query("SELECT * FROM files");
  } finally {
    conn.end();
  }
};

/**
 * Selects id, name from files.
 */
module.exports.selectIdAndName = selectIdAndName = async () => {
  const conn = mysql.createConnection(connection);
  try {
    const query = util.promisify(conn.query).bind(conn);
    const string = mysql
      .format("SELECT id, Name FROM files")
      .split("''")
      .join("'");
    return await query(string);
  } finally {
    conn.end();
  }
};

/**
 * Selects all from files where is removed.
 */
module.exports.selectAllRemoved = selectAllByRemoved = async () => {
  const conn = mysql.createConnection(connection);
  try {
    const query = util.promisify(conn.query).bind(conn);
    const string = mysql
      .format("SELECT * FROM files WHERE isRemoved = 1")
      .split("''")
      .join("'");
    return await query(string);
  } finally {
    conn.end();
  }
};

/**
 * Select all from files where path matches.
 */
module.exports.selectAllFilesByPath = selectAllByPath = async (file) => {
  const conn = mysql.createConnection(connection);
  try {
    const query = util.promisify(conn.query).bind(conn);
    const string = mysql
      .format("SELECT * FROM files WHERE path = ?", [file])
      .split("''")
      .join("'");
    return await query(string);
  } finally {
    conn.end();
  }
};

/**
 * Selects all from files where path matches and is removed.
 */
module.exports.selectAllFilesByPath = selectAllByPathAndRemoved = async (
  file
) => {
  const conn = mysql.createConnection(connection);
  try {
    const query = util.promisify(conn.query).bind(conn);
    const string = mysql
      .format("SELECT * FROM files WHERE path = ? AND isRemoved = 1", [file])
      .split("''")
      .join("'");
    return await query(string);
  } finally {
    conn.end();
  }
};

/**
 * Selects id from files where path and name matches.
 */
module.exports.selectByPathAndName = selectIdByPathAndName = async (
  path,
  name
) => {
  const conn = mysql.createConnection(connection);
  try {
    const query = util.promisify(conn.query).bind(conn);
    const string = mysql
      .format("SELECT id FROM files WHERE path = ? AND name = ?", [path, name])
      .split("''")
      .join("'");
    return await query(string);
  } finally {
    conn.end();
  }
};
