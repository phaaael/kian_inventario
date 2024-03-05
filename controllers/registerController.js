const registerDatabase = require('../resources/database')

const getRegister = (req, res) => {
    const dynamicData = { message: 'Registrar' }

    res.render('register', { data: dynamicData })
};

const register = async (req, res) => {
    const { username, password, password_validation, name, surname } = req.body
    try {
        if (password !== password_validation) return res.send('<script>alert("As senhas não coincidem"); window.location.href = "/register";</script>')

        const insert = 'INSERT INTO kian_usuarios(usuario, senha, nome, sobrenome) VALUES(?, ?, ?, ?)'
        await registerDatabase.pool.execute(insert, [username, password, name, surname])

        res.send('<script>alert("Credenciais registradas"); window.location.href = "/";</script>')
    } catch (error) {
        res.status(500).send('Erro interno ao enviar credenciais')
    }
};

module.exports = { getRegister, register }