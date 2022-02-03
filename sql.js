config
const { config } = require('dotenv');
const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,    
    password:
    user:
    database:
    host:
    port:
}); 