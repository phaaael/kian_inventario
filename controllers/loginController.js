const loginDatabase = require('../resources/database')

const login = async (req, res) => {
    const { username, password } = req.body

    try {
        const [ results ] = await loginDatabase.pool.execute('SELECT * FROM kian_usuarios WHERE usuario = ? AND senha = ?', [username, password])

        if (results.length > 0) {
            req.session.username = results[0].usuario
            res.json({ success: true, message: "Sucesso"})
        } else {
            res.json({ success: false, message: "Credenciais Inválidas" })
        }             
    } catch (error) {
        res.status(500).send('Erro interno ao verificar credenciais')
    }
}

module.exports = { login }