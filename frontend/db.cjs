// db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

//const API_BASE = "http://helloschool.sohan-birotheau.fr";
const API_BASE = "localhost:5000";

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
