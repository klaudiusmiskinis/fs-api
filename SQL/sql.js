const { connection, mysql, util } = require("../services/db");


/* TRUNCATE */
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

/* INSERTS */
/**
 * Makes a massive insert into table files with a bulked parameter. Parameter format: [[],[]]
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

/* UPDATE */
module.exports.updateName = updateName = async (idFile, newName) => {
  const conn = mysql.createConnection(connection);
  try {
    const query = util.promisify(conn.query).bind(conn);
    const string = mysql
      .format("UPDATE files SET name = ? WHERE files.id = ?", [newName, idFile])
      .split("''")
      .join("'");
    return await query(string);
  } finally {
    conn.end();
  }
};

module.exports.updateVersion = updateVersion = async (idFile) => {
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

module.exports.updateDelete = updateDelete = async (date, idFile) => {
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
