const mysql = require('mysql2/promise')

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '84013358',
    database: 'kian',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function getUserByUsername(username) {
  const [rows] = await pool.execute('SELECT * FROM kian_usuarios WHERE usuario = ?', [username])
  return rows[0]
}

module.exports = { pool, getUserByUsername}