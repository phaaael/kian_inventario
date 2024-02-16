const inventoryDatabase = require('../database')

const inventory = async (req, res) => {
    try {
        if (req.session && req.session.username) {
            const [ rows ] = await inventoryDatabase.pool.execute('SELECT * FROM kian_ativos;')
            const userData = await inventoryDatabase.getUserByUsername(req.session.username)

            if (rows && userData.cargo === 'Administrador') {
                const actives = rows.map(active => ({
                    requester: active.solicitante,
                    exit_sector: active.saida_setor,
                    equipment: active.equipamento,
                    identification_code: active.codigo_identificacao,
                    delivery_forecast: active.previsao_entrega
                }))

                res.render('inventory', { actives: actives } )
            } else {
                res.send('Usuário sem permissão')
            }
        } else {
            res.redirect('/')
        }
    } catch (error) {
        res.render('error', { error: 'Erro ao obter dados do perfil' })
    }
}

const inventoryRegistration = (req, res) => {
    try {
        if (req.session && req.session.username) {
            res.render('inventory_registration')
        } else {
            res.redirect('/')
        }
    } catch (error) {
        res.render('error', { error: 'Erro no cadastro de equipamento' })
    }
}

const inventoryRegisterItem = async (req, res) => {
    const { requester, exit_sector, equipment, identification_code, delivery_forecast } = req.body
    try {
        const insert = 'INSERT INTO kian_ativos(solicitante, saida_setor, equipamento, codigo_identificacao, previsao_entrega) VALUES(?, ?, ?, ?, ?)'
        await inventoryDatabase.pool.execute(insert, [requester, exit_sector, equipment, identification_code, delivery_forecast])

        res.send('<script>alert("Ativo Registrado"); window.location.href = "/inventory/registration";</script>')
    } catch (error) {
        res.status(500).send('Erro interno ao enviar registro')
    }
}

const getMenuInventory = async (req, res) => {
    try {
        if (req.session && req.session.username) {
            const username = req.session.username;

            const userData = await inventoryDatabase.getUserByUsername(username)

            if (userData) {
                const data = {
                    name: userData.nome,
                    surname: userData.sobrenome,
                    charge: userData.cargo
                }

                res.render('inventory_functions', { data: data })
            } else {
                res.redirect('/')
            }
        } else {
            res.redirect('/')
        }
    } catch (error) {
        res.render('error', { error: 'Erro ao obter dados do perfil' })
    }
}

const logout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
          res.status(500).send('Erro ao finalizar sessão')
        } else {
          res.redirect('/')
        }
    })
}

module.exports = { getMenuInventory, inventoryRegistration, inventoryRegisterItem, inventory, logout }