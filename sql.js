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
 * Selects all the files from table archivos.
 */
module.exports.selectAll = selectAll = async () => {
  const conn = mysql.createConnection(connection);
  try {
    const query = util.promisify(conn.query).bind(conn);
    return await query("SELECT * FROM archivos");
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
      .format("SELECT idArchivo FROM archivos WHERE ruta = ? AND nombre = ?", [
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
 * Makes a massive insert into table archivos with a bulked parameter. Parameter format: [[],[]]
 */
module.exports.insertBulkedFiles = insertBulkedFiles = async (archivos) => {
  const conn = mysql.createConnection(connection);
  try {
    const query = util.promisify(conn.query).bind(conn);
    const string = mysql
      .format(
        "INSERT INTO archivos(nombre, ruta, fechaCreacion, ultimaVersion) VALUES ?",
        [archivos]
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
        "INSERT INTO archivos(nombre, ruta, fechaCreacion, ultimaVersion) VALUES (?)",
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
        "INSERT INTO archivos(nombre, ruta, idPadre, fechaCreacion, ultimaVersion) VALUES (?)",
        [file]
      )
      .split("''")
      .join("'");
    return await query(string);
  } finally {
    conn.end();
  }
};

module.exports.insertFileWithParenAndtReason = insertFileWithParenAndtReason =
  async (file) => {
    const conn = mysql.createConnection(connection);
    try {
      const query = util.promisify(conn.query).bind(conn);
      const string = mysql
        .format(
          "INSERT INTO archivos(nombre, ruta, idPadre, fechaCreacion, ultimaVersion) VALUES (?)",
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
      .format("UPDATE archivos SET nombre = ? WHERE archivos.idArchivo = ?", [
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
      .format("UPDATE archivos SET ultimaVersion = 0 WHERE idArchivo = ?", [
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
        "UPDATE archivos SET eliminado = 1, fechaEliminado = ?, ultimaVersion = 0 WHERE idArchivo = ?",
        [date, idFile]
      )
      .split("''")
      .join("'");
    return await query(string);
  } finally {
    conn.end();
  }
};
