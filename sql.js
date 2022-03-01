require('dotenv').config();
const util = require('util');
const mysql = require('mysql2');

const connection = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PWD,
    database: process.env.MYSQL_DB
}

module.exports.test = test = () => (async() => {
    const conn = mysql.createConnection(connection);
    try {
        const query = util.promisify(conn.query).bind(conn);
        return await query('select count(*) as count from archivos');
    } finally {
      conn.end();
    }
})();

module.exports.selectAllFiles = selectAllFiles = () => (async() => {
    const conn = mysql.createConnection(connection);
    try {
        const query = util.promisify(conn.query).bind(conn);
        return await query('select * from archivos');
    } finally {
        conn.end();
    }
})();

module.exports.selectAllFiles = selectAllFiles = () => (async() => {
    const conn = mysql.createConnection(connection);
    try {
        const query = util.promisify(conn.query).bind(conn);
        return await query('select * from archivos');
    } finally {
        conn.end();
    }
})();

module.exports.cleanArchivos = cleanArchivos = () => (async() => {
    const conn = mysql.createConnection(connection);
    try {
        const query = util.promisify(conn.query).bind(conn);
        return await query('TRUNCATE TABLE archivos');
    } finally {
        conn.end();
    }
})();


module.exports.insertArchivos = insertArchivos = (archivos) => (async() => {
    const conn = mysql.createConnection(connection);
    try {
        const query = util.promisify(conn.query).bind(conn);
        return await query('TRUNCATE TABLE archivos');
    } finally {
        conn.end();
    }
})();