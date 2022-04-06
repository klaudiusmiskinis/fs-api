require("dotenv").config();
const util = require("util");
const mysql = require("mysql2");
const connection = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PWD,
  database: process.env.MYSQL_DB,
};

/* SELECTS */
/**
 * Selects all the files from table files.
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

module.exports.selectAllRemoved = selectAllRemoved = async () => {
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

module.exports.selectAllFilesByPath = selectAllByPath = async (file) => {
  const conn = mysql.createConnection(connection);
  try {
    const query = util.promisify(conn.query).bind(conn);
    const string = mysql
      .format(
        "SELECT * FROM files WHERE path = ?",
        [file]
      )
      .split("''")
      .join("'");
    return await query(string);
  } finally {
    conn.end();
  }
};

module.exports.selectAllFilesByPath = selectRemovedByPath = async (file) => {
  const conn = mysql.createConnection(connection);
  try {
    const query = util.promisify(conn.query).bind(conn);
    const string = mysql
      .format(
        "SELECT * FROM files WHERE path = ? AND isRemoved = 1",
        [file]
      )
      .split("''")
      .join("'");
    return await query(string);
  } finally {
    conn.end();
  }
};

module.exports.selectByPathAndName = selectByPathAndName = async (
  path,
  name
) => {
  const conn = mysql.createConnection(connection);
  try {
    const query = util.promisify(conn.query).bind(conn);
    const string = mysql
      .format("SELECT id FROM files WHERE path = ? AND name = ?", [
        path,
        name,
      ])
      .split("''")
      .join("'");
    return await query(string);
  } finally {
    conn.end();
  }
};

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
      .format("UPDATE files SET name = ? WHERE files.id = ?", [
        newName,
        idFile,
      ])
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
      .format("UPDATE files SET isLastVersion = 0 WHERE id = ?", [
        idFile,
      ])
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
