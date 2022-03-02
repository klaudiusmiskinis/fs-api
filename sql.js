require('dotenv').config();
const util = require('util');
const mysql = require('mysql2');
const connection = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PWD,
    database: process.env.MYSQL_DB
}

/**
 * Makes a select with a count in archivos. Used for testing.
 */
module.exports.test = test = () => (async() => {
    const conn = mysql.createConnection(connection);
    try {
        const query = util.promisify(conn.query).bind(conn);
        return await query('SELECT count(*) as count FROM archivos');
    } finally {
      conn.end();
    }
})();

/**
 * SELECT all the files from table archivos.
 */
module.exports.selectAllFiles = selectAllFiles = () => (async() => {
    const conn = mysql.createConnection(connection);
    try {
        const query = util.promisify(conn.query).bind(conn);
        return await query('SELECT * FROM archivos');
    } finally {
        conn.end();
    }
})();

/**
 * SELECT all the versions from table versiones.
 */
module.exports.selectAllVersions = selectAllVersions = () => (async() => {
    const conn = mysql.createConnection(connection);
    try {
        const query = util.promisify(conn.query).bind(conn);
        return await query('SELECT * FROM versiones');
    } finally {
        conn.end();
    }
})();

/**
 * Purges the table archivos.
 */
module.exports.cleanArchivos = cleanArchivos = () => (async() => {
    const conn = mysql.createConnection(connection);
    try {
        const query = util.promisify(conn.query).bind(conn);
        return await query('TRUNCATE TABLE archivos');
    } finally {
        conn.end();
    }
})();

/**
 * Purges the table versiones.
 */
module.exports.cleanVersiones = cleanVersiones = () => (async() => {
    const conn = mysql.createConnection(connection);
    try {
        const query = util.promisify(conn.query).bind(conn);
        return await query('TRUNCATE TABLE versiones');
    } finally {
        conn.end();
    }
})();

/**
 * Makes a massive insert into table archivos
 */
module.exports.insertArchivos = insertArchivos = (archivos) => (async() => {
    const conn = mysql.createConnection(connection);
    try {
        const query = util.promisify(conn.query).bind(conn);
        return await query('');
    } finally {
        conn.end();
    }
})();