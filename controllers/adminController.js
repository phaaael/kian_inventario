const adminDatabase = require('../resources/database')

const userManagement = async (req, res) => {
    try {
        if (req.session && req.session.username) {
            const userData = await adminDatabase.getUserByUsername(req.session.username)
            if (!userData || userData.cargo !== 'Administrador') return res.send('Usuário sem permissão')

            let query = 'SELECT * FROM kian_usuarios WHERE 1=1'
            const [rows] = await adminDatabase.pool.execute(query)

            if (rows && userData.cargo === 'Administrador') {
                const actives = rows.map(active => ({
                    id: active.id,
                    registration: active.matricula,
                    user: active.usuario,
                    email: active.email,
                    name: active.nome,
                    sector: active.setor,
                    charge: active.cargo
                }))

                res.render('admin/user-management', { actives })
            }
        } else {
            res.redirect('/')
        }
    } catch (error) {
        res.render('error', { error: 'Erro ao obter dados de administrador' })
    }
}

module.exports = { userManagement }