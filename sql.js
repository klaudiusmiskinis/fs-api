require('dotenv').config();
const util = require('util');
const mysql = require('mysql2');
const LoginMysql = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PWD,
    database: process.env.MYSQL_DB
}

module.exports.test = test = () => (async() => {
    const conn = mysql.createConnection(LoginMysql);
    try {
        const query = util.promisify(conn.query).bind(conn);
        const rows = await query('select count(*) as count from archivos');
        return rows;
    } finally {
      conn.end();
    }
})()

module.exports.selectAllFiles = selectAllFiles = () => (async() => {
    const conn = mysql.createConnection(LoginMysql);
    try {
        const query = util.promisify(conn.query).bind(conn);
        const rows = await query('select * from archivos');
        return rows;
    } finally {
        conn.end();
    }
})