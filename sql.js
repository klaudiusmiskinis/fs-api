require("dotenv").config();
const util = require("util");
const mysql = require("mysql2");
const connection = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PWD,
  database: process.env.MYSQL_DB,
};

/**
 * Selects with a count in archivos. Used for testing.
 */
module.exports.test = test = () =>
  (async () => {
    const conn = mysql.createConnection(connection);
    try {
      const query = util.promisify(conn.query).bind(conn);
      return await query("SELECT count(*) as count FROM archivos");
    } finally {
      conn.end();
    }
  })();

/**
 * Selects all the files from table archivos.
 */
module.exports.selectAllFiles = selectAllFiles = () =>
  (async () => {
    const conn = mysql.createConnection(connection);
    try {
      const query = util.promisify(conn.query).bind(conn);
      return await query("SELECT * FROM archivos");
    } finally {
      conn.end();
    }
  })();

/**
 * Selects all the versions from table versiones.
 */
module.exports.selectAllVersions = selectAllVersions = () =>
  (async () => {
    const conn = mysql.createConnection(connection);
    try {
      const query = util.promisify(conn.query).bind(conn);
      return await query("SELECT * FROM versiones");
    } finally {
      conn.end();
    }
  })();

/**
 * Purges the table given by a parameter.
 */
module.exports.purgeTable = purgeTable = (table) =>
  (async () => {
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
  })();

/**
 * Makes a massive insert into table archivos.
 */
module.exports.insertArchivos = insertArchivos = (archivos) =>
  (async () => {
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
  })();

module.exports.newFile = newFile = (file) =>
  (async () => {
    const conn = mysql.createConnection(connection);
    try {
      const query = util.promisify(conn.query).bind(conn);
      console.log( mysql
        .format(
          "INSERT INTO archivos(nombre, ruta, fechaCreacion, ultimaVersion) VALUES ?",
          [file]
        )
        .split("'")
        .join(""))
      const string = mysql
        .format(
          "INSERT INTO archivos(nombre, ruta, fechaCreacion, ultimaVersion) VALUES ?",
          [file]
        )
        .split("''")
        .join("'");
      return await query(string);
    } finally {
      conn.end();
    }
  })();

module.exports.rename = rename = (idFile, newName) =>
  (async () => {
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
  })();

module.exports.selectByPathAndName = selectByPathAndName = (path, name) =>
  (async () => {
    const conn = mysql.createConnection(connection);
    try {
      const query = util.promisify(conn.query).bind(conn);
      const string = mysql
        .format(
          "SELECT `idArchivo` FROM `archivos` WHERE ruta = ? AND nombre = ?",
          [path, name]
        )
        .split("''")
        .join("'");
      return await query(string);
    } finally {
      conn.end();
    }
  })();
