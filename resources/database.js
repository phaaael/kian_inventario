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

const getUserByUsername = async (username) => {
  const [ rows ] = await pool.execute('SELECT * FROM kian_usuarios WHERE usuario = ?', [username])
  return rows[ 0 ]
}

const getItemById = async (itemId) => {
  const [ rows ] = await pool.execute('SELECT * FROM kian_suprimentos WHERE id = ?', [itemId])
  return rows[ 0 ]
}

const getRequirements = async (name) => {
  const [ rows ] = await pool.execute('SELECT * FROM kian_solicitacoes WHERE requerente = ?', [name])
  return rows
}
const updateItemQuantity = async (itemId, newQuantity) => {
  try {
      const [ result ] = await pool.execute('UPDATE kian_suprimentos SET qtd_item = ? WHERE id = ?', [newQuantity, itemId])
      
      if (result.affectedRows === 0) {
          console.log('Nenhum item encontrado com o ID fornecido para atualização.')
          return false
      }
      
      return true
  } catch (error) {
      console.error('Erro ao atualizar a quantidade do item:', error)
      throw error
  }
}

const updateItemQuantityCritical = async (itemId, newQuantity) => {
  try {
      const [ result ] = await pool.execute('UPDATE kian_suprimentos SET qtd_critica = ? WHERE id = ?', [newQuantity, itemId])
      
      if (result.affectedRows === 0) return false
      
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
  getRequirements,
  updateItemQuantity,
  updateItemQuantityCritical
}