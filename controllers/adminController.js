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

const getUserCreation = async (req, res) => {
    try {
        if (req.session && req.session.username) {
            const userData = await adminDatabase.getUserByUsername(req.session.username)

            if (!userData || userData.cargo !== 'Administrador') return res.send('Usuário sem permissão')

            res.render('admin/user-creation')
        } else {
            res.redirect('/')
        }
    } catch (error) {
        res.render('error', { error: 'Erro ao obter dados de criação do usuário' })
    }
}

const userCreation = async (req, res) => {
    const { registration, username, password, password_validation, name, email, sector, charge } = req.body
    try {
        if (req.session && req.session.username) {
            const userData = await adminDatabase.getUserByUsername(req.session.username)

            if (!userData || userData.cargo !== 'Administrador') return res.send('Usuário sem permissão')
            if (password !== password_validation) return res.json({ success: false, message: "As senhas não coincidem" })

            const insert = 'INSERT INTO kian_usuarios(matricula, usuario, senha, email, nome, setor, cargo ) VALUES(?, ?, ?, ?, ?, ?, ?)'
            await adminDatabase.pool.execute(insert, [registration, username, password, email, name, sector, charge])
        
            res.json({ success: true })
        } else {
            res.redirect('/')
        }
    } catch(error) {
        res.render('error', { error: 'Erro ao cadastrar usuário' })
    }
}

const supplyManagement = async (req, res) => {
    try {
        if (req.session && req.session.username) {
            const userData = await adminDatabase.getUserByUsername(req.session.username)
            if (!userData || userData.cargo !== 'Administrador') return res.send('Usuário sem permissão')

            let query = 'SELECT * FROM kian_suprimentos WHERE 1=1'
            const [rows] = await adminDatabase.pool.execute(query)

            if (rows && userData.cargo === 'Administrador') {
                const actives = rows.map(active => ({
                    id: active.id,
                    item: active.item,
                    qtd_item: active.qtd_item
                }))

                res.render('admin/supply-management', { actives })
            }
        } else {
            res.redirect('/')
        }
    } catch (error) {
        res.render('error', { error: 'Erro ao obter dados de administrador' })
    }
}

const equipmentManagement = async (req, res) => {
    try {
        if (req.session && req.session.username) {
            const userData = await adminDatabase.getUserByUsername(req.session.username)
            if (!userData || userData.cargo !== 'Administrador') return res.send('Usuário sem permissão')

            let query = 'SELECT * FROM kian_equipamentos WHERE 1=1'
            const [rows] = await adminDatabase.pool.execute(query)

            if (rows && userData.cargo === 'Administrador') {
                const actives = rows.map(active => ({
                    id: active.id,
                    item: active.item,
                    identifier: active.codigo_identificacao,
                    borrowed: active.emprestado === 1 ? 'Emprestado' : 'Em Estoque'
                }))

                res.render('admin/equipament-management', { actives })
            }
        } else {
            res.redirect('/')
        }
    } catch (error) {
        res.render('error', { error: 'Erro ao obter dados de administrador' })
    }
}

const getSupplyEntry = async (req, res) => {
    try {
        if (req.session && req.session.username) {
            const userData = await adminDatabase.getUserByUsername(req.session.username)

            if (!userData || userData.cargo !== 'Administrador') return res.send('Usuário sem permissão')

            res.render('admin/supply-entry')
        } else {
            res.redirect('/')
        }
    } catch (error) {
        res.render('error', { error: 'Erro ao obter dados para abastecer o estoque' })
    }
}

module.exports = {
    userManagement,
    userCreation,
    getUserCreation,
    equipmentManagement,
    getSupplyEntry,
    supplyManagement
}