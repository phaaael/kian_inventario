const registerDatabase = require('../resources/database')

const getRegister = (req, res) => {
    const dynamicData = { message: 'Registrar' }

    res.render('register', { data: dynamicData })
};

const register = async (req, res) => {
    const { username, password, password_validation, name, surname } = req.body
    try {
        if (password !== password_validation) {
            return res.json({ success: false, message: "As senhas não coincidem" })
        }

        const insert = 'INSERT INTO kian_usuarios(usuario, senha, nome, sobrenome) VALUES(?, ?, ?, ?)'
        await registerDatabase.pool.execute(insert, [username, password, name, surname])

        res.json({ success: true })
    } catch (error) {
        res.status(500).send('Erro interno ao enviar credenciais')
    }
}

module.exports = { getRegister, register }
