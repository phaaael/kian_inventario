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

async function getItemById(itemId) {
  const [rows] = await pool.execute('SELECT * FROM kian_suprimentos WHERE id = ?', [itemId])
  return rows[0]
}

async function updateItemQuantity(itemId, newQuantity) {
  try {
      const [ result ] = await pool.execute('UPDATE kian_suprimentos SET qtd_item = ? WHERE id = ?', [newQuantity, itemId])
      
      if (result.affectedRows === 0) {
          console.log('Nenhum item encontrado com o ID fornecido para atualização.')
          return false
      }

      console.log(`A quantidade do item com ID ${itemId} foi atualizada para ${newQuantity}.`)
      return true
  } catch (error) {
      console.error('Erro ao atualizar a quantidade do item:', error)
      throw error
  }
}


module.exports = { 
  pool, 
  getUserByUsername, 
  getItemById,
  updateItemQuantity
}