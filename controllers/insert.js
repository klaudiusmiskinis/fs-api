const { connection, mysql, util } = require("../services/db");

/**
 * Makes a massive insert into table files.
 */
module.exports.insertBulkedFiles = insertBulkedFiles = async (files) => {
  const conn = mysql.createConnection(connection);
  try {
    const query = util.promisify(conn.query).bind(conn);
    const string = mysql
      .format(
        "INSERT INTO files(name, path, created_date, isLastVersion) VALUES ?",
        [files]
      )
      .split("''")
      .join("'");
    return await query(string);
  } finally {
    conn.end();
  }
};

module.exports.insertFile = insertFile = async (file) => {
  const conn = mysql.createConnection(connection);
  try {
    const query = util.promisify(conn.query).bind(conn);
    const string = mysql
      .format(
        "INSERT INTO files(name, path, created_date, isLastVersion) VALUES (?)",
        [file]
      )
      .split("''")
      .join("'");
    return await query(string);
  } finally {
    conn.end();
  }
};

module.exports.insertFileWithReason = insertFileWithReason = async (file) => {
  const conn = mysql.createConnection(connection);
  try {
    const query = util.promisify(conn.query).bind(conn);
    const string = mysql
      .format(
        "INSERT INTO files(name, path, created_date, isLastVersion, reason) VALUES (?)",
        [file]
      )
      .split("''")
      .join("'");
    return await query(string);
  } finally {
    conn.end();
  }
};

module.exports.insertFileWithParentAndReason = insertFileWithParentAndReason =
  async (file) => {
    const conn = mysql.createConnection(connection);
    try {
      const query = util.promisify(conn.query).bind(conn);
      const string = mysql
        .format(
          "INSERT INTO files(name, path, idParent, created_date, isLastVersion, reason) VALUES (?)",
          [file]
        )
        .split("''")
        .join("'");
      return await query(string);
    } finally {
      conn.end();
    }
  };

module.exports.insertFileWithParent = insertFileWithParent = async (file) => {
  const conn = mysql.createConnection(connection);
  try {
    const query = util.promisify(conn.query).bind(conn);
    const string = mysql
      .format(
        "INSERT INTO files(name, path, idParent, created_date, isLastVersion) VALUES (?)",
        [file]
      )
      .split("''")
      .join("'");
    return await query(string);
  } finally {
    conn.end();
  }
};
