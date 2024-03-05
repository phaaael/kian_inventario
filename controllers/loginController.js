const loginDatabase = require('../resources/database')

const login = async (req, res) => {
    const { username, password } = req.body

    try {
        const [results, fields] = await loginDatabase.pool.execute('SELECT * FROM kian_usuarios WHERE usuario = ? AND senha = ?', [username, password])

        if (results.length > 0) {
            req.session.username = results[0].usuario
                res.redirect('/inventory/menu')
        } else {
            res.send('<script>alert("Credenciais inválidas!"); window.location.href = "/";</script>')
        }
    } catch (error) {
        res.status(500).send('Erro interno ao verificar credenciais')
    }
}

module.exports = { login }