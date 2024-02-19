const inventoryDatabase = require('../database')
const noticeData = require('../notice')

const inventory = async (req, res) => {
    try {
        if (req.session && req.session.username) {
            const [ rows ] = await inventoryDatabase.pool.execute('SELECT * FROM kian_emprestimos;')
            const userData = await inventoryDatabase.getUserByUsername(req.session.username)

            if (rows && userData.cargo === 'Administrador') {
                const actives = rows.map(active => ({
                    id: active.id,
                    responsible_loan: active.responsavel_emprestimo,
                    requester: active.solicitante,
                    exit_sector: noticeData.formatDate(new Date (active.saida_setor)),
                    equipment: active.equipamento,
                    identification_code: active.codigo_identificacao,
                    delivery_forecast: noticeData.formatDate(new Date (active.previsao_entrega)),
                    delivered: active.entregue
                }))

                res.render('inventory', { actives: actives } )
            } else {
                res.send('Usuário sem permissão')
            }
        } else {
            res.redirect('/')
        }
    } catch (error) {
        res.render('error', { error: 'Erro ao obter dados do invetario' })
    }
}

const inventoryListAllRequests = async (req, res) => {
    try {
        if (req.session && req.session.username) {
            const [ rows ] = await inventoryDatabase.pool.execute('SELECT * FROM kian_emprestimos;')
            const userData = await inventoryDatabase.getUserByUsername(req.session.username)

            if (rows && userData.cargo === 'Administrador') {
                const actives = rows.map(active => ({
                    id: active.id,
                    responsible_loan: active.responsavel_emprestimo,
                    requester: active.solicitante,
                    exit_sector: noticeData.formatDate(new Date (active.saida_setor)),
                    equipment: active.equipamento,
                    identification_code: active.codigo_identificacao,
                    delivery_forecast: noticeData.formatDate(new Date (active.previsao_entrega)),
                    delivered: active.entregue,
                    loan_completed: active.finalizacao_emprestimo,
                    completion_date: noticeData.formatDateWithCheck(active.dt_finalizacao)
                }))

                res.render('inventory_allrequests', { actives: actives } )
            } else {
                res.send('Usuário sem permissão')
            }
        } else {
            res.redirect('/')
        }
    } catch (error) {
        res.render('error', { error: 'Erro ao obter dados do invetario' })
    }
}

const inventoryItemDelivered = async (req, res) => {
    try {
        if (req.session && req.session.username) {
            const itemId = req.params.id

            if (!itemId) return res.status(400).send('ID do item não fornecido')

            const username = req.session.username

            const currentDate = new Date()
            const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ')

            const updateQuery = 'UPDATE kian_emprestimos SET finalizacao_emprestimo = ?, dt_finalizacao = ?, entregue = ? WHERE id = ?'
            await inventoryDatabase.pool.execute(updateQuery, [username, formattedDate, true, itemId])

            res.send('<script>alert("Solicitação Finalizada"); window.location.href = "/inventory";</script>')
        } else {
            res.status(403).send('Acesso não autorizado')
        }
    } catch (error) {
        console.error('Erro ao marcar item como entregue:', error)
        res.status(500).send('Erro interno ao marcar item como entregue')
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
    const { responsible_loan, requester, exit_sector, equipment, identification_code, delivery_forecast } = req.body
    try {
        const insert = 'INSERT INTO kian_emprestimos(responsavel_emprestimo, solicitante, saida_setor, equipamento, codigo_identificacao, previsao_entrega) VALUES(?, ?, ?, ?, ?, ?)'
        await inventoryDatabase.pool.execute(insert, [responsible_loan, requester, exit_sector, equipment, identification_code, delivery_forecast])

        res.send('<script>alert("Solicitação Registrada"); window.location.href = "/inventory/registration";</script>')
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

module.exports = { getMenuInventory, inventoryRegistration, inventoryRegisterItem, inventoryItemDelivered, inventoryListAllRequests, inventory, logout }