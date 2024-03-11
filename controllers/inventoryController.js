const inventoryDatabase = require('../resources/database')
const spreadsheet = require('../resources/spreadsheet_export')
const notice = require('../resources/notice')

const inventory = async (req, res) => {
    try {     
        const { searchChar, searchField, startDate, endDate } = req.query

        let query = 'SELECT * FROM kian_emprestimos WHERE 1=1'
        let queryParams = []

        if (searchChar && searchField) {
            query += ` AND ${searchField} LIKE ?`
            queryParams.push(`%${searchChar}%`)
        }

        if (startDate) {
            query += ' AND previsao_entrega >= ?'
            queryParams.push(startDate)
        }

        if (endDate) {
            query += ' AND previsao_entrega <= ?'
            queryParams.push(endDate)
        }

        const [rows] = await inventoryDatabase.pool.execute(query, queryParams)
        const userData = await inventoryDatabase.getUserByUsername(req.session.username)

        if (rows && userData.cargo === 'Administrador') {
            const actives = rows.map(active => ({
                id: active.id,
                responsible_loan: active.responsavel_emprestimo,
                requester: active.solicitante,
                exit_sector: notice.formatDate(new Date (active.saida_setor)),
                equipment: active.equipamento,
                identification_code: active.codigo_identificacao,
                delivery_forecast: notice.formatDate(new Date (active.previsao_entrega)),
                delivered: active.entregue
            }))

            res.render('inventory', { actives: actives } )
        } else {
            res.send('Usuário sem permissão')
        }
    } catch (error) {
        res.render('error', { error: 'Erro ao obter dados do invetario' })
    }
}

const inventoryRequestLoan = async (req, res) => {
    try {
        if (req.method === 'GET') {
            const query = `
                        SELECT kian_estoque.*
                        FROM kian_estoque
                        LEFT JOIN kian_solicitacoes ON kian_estoque.id = kian_solicitacoes.equipamento
                        AND kian_solicitacoes.status_solicitacao IS NULL
                        WHERE kian_estoque.emprestado = 0 AND kian_solicitacoes.equipamento IS NULL;
            `
            
            const [row] = await inventoryDatabase.pool.execute(query)
            res.render('inventory_requestloan', { row })
        } else if (req.method === 'POST') {
            const { exit_sector, item, request_reason, delivery_forecast } = req.body
            const userData = await inventoryDatabase.getUserByUsername(req.session.username)

            if (!userData || !userData.nome) { throw new Error('Usuário não encontrado ou não logado') }

            const itemQuery = 'SELECT item, codigo_identificacao FROM KIAN_ESTOQUE WHERE id = ?'
            const [[{ item: itemName, codigo_identificacao: codigoId }]] = await inventoryDatabase.pool.execute(itemQuery, [item])

            if (!itemName || !codigoId) { throw new Error('Item ou Código de Identificação não encontrado.') }

            const insertQuery = `
                INSERT INTO KIAN_SOLICITACOES (solicitante, saida_setor, equipamento, codigo_identificacao, motivo_emprestimo, previsao_entrega)
                VALUES (?, ?, ?, ?, ?, ?)
            `
            
            await inventoryDatabase.pool.execute(insertQuery, [userData.nome, exit_sector, itemName, codigoId, request_reason, delivery_forecast])

            const updateQuery = 'UPDATE kian_estoque SET emprestado = 1 WHERE id = ?'
            await inventoryDatabase.pool.execute(updateQuery, [item])

            res.json({ success: true, message: "Solicitação de Empréstimo Enviada" })
        }
    } catch (error) {
        console.error(error)
        res.render('error', { error: 'Erro ao solicitar equipamento: ' + error.message })
    }
}

const inventoryAcceptItem = async (req, res) => {
    try {
        const itemId = req.params.id
        const userData = await inventoryDatabase.getUserByUsername(req.session.username)
        
        if (!itemId) return res.status(400).json({ success: false, message: 'ID do item não fornecido' })

        const updateQuery = 'UPDATE kian_solicitacoes SET status_solicitacao = ? WHERE id = ?'
        const [updateResult] = await inventoryDatabase.pool.execute(updateQuery, [true, itemId])

        if (updateResult.affectedRows > 0) {
            const selectQuery = `SELECT solicitante, saida_setor, equipamento, codigo_identificacao, motivo_emprestimo, previsao_entrega FROM kian_solicitacoes WHERE id = ?`
            const [rows] = await inventoryDatabase.pool.execute(selectQuery, [itemId])

            if (rows.length > 0) {
                const loan = rows[0]
                const insertQuery = `INSERT INTO kian_emprestimos (responsavel_emprestimo, solicitante, saida_setor, equipamento, codigo_identificacao, motivo_emprestimo, previsao_entrega) VALUES (?, ?, ?, ?, ?, ?, ?)`
                await inventoryDatabase.pool.execute(insertQuery, [userData.nome, loan.solicitante, loan.saida_setor, loan.equipamento, loan.codigo_identificacao, loan.motivo_emprestimo, loan.previsao_entrega])

                res.json({ success: true, message: "Solicitação Aceita" })
            } else {
                res.status(404).json({ success: false, message: 'Nenhum registro encontrado para atualizar' })
            }
        } else {
            res.status(404).json({ success: false, message: 'Atualização da solicitação falhou' })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: 'Erro ao aceitar solicitação' })
    }
}

const inventoryRefuseItem = async (req, res) => {
    try {       
        const itemId = req.params.id

        if (!itemId) return res.status(400).json({ success: false, message: 'ID do item não fornecido' })

        const updateQuery = 'UPDATE kian_solicitacoes SET status_solicitacao = ?, solicitacao_recusada = ? WHERE id = ?;'
        await inventoryDatabase.pool.execute(updateQuery, [true, true, itemId])

        res.json({ success: true, message: "Solicitação Recusada" })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao recusar solicitação' })
    }
}

const inventoryChangeItem = async (req, res) => {
    try {       
        const itemId = req.params.id
        const [rows] = await inventoryDatabase.pool.execute('SELECT * FROM kian_emprestimos WHERE id = ?', [itemId])
        const userData = await inventoryDatabase.getUserByUsername(req.session.username)

        if (rows.length > 0 && userData.cargo === 'Administrador') {
            const active = rows[0]
            const activeData = {
                id: active.id,
                responsible_loan: active.responsavel_emprestimo,
                requester: active.solicitante,
                exit_sector: notice.formatDate(new Date(active.saida_setor)),
                equipment: active.equipamento,
                identification_code: active.codigo_identificacao,
                delivery_forecast: notice.formatDate(new Date(active.previsao_entrega)),
                delivered: active.entregue,
                loan_completed: active.finalizacao_emprestimo,
                completion_date: notice.formatDateWithCheck(active.dt_finalizacao)
            }
            res.render('inventory_changeitem', { active: activeData })
        } else {
            res.send('Usuário sem permissão ou item não encontrado')
        }
  
    } catch (error) {
        res.render('error', { error: 'Erro ao carregar dados para alteração' })
    }
}

const inventoryUpdateRecord = async (req, res) => {
    try {       
        const { id, responsible_loan, requester, exit_sector, equipment, identification_code, delivery_forecast, delivered } = req.body

        const [rows] = await inventoryDatabase.pool.execute('SELECT * FROM kian_emprestimos WHERE id = ?', [id])
        const active = rows[0]

        const updateFields = {}

        if (responsible_loan && responsible_loan !== active.responsavel_emprestimo) {
            updateFields.responsavel_emprestimo = responsible_loan
        }

        if (requester && requester !== active.solicitante) {
            updateFields.solicitante = requester
        }

        if (exit_sector && exit_sector !== active.saida_setor) {
            const formattedExitSector = notice.formatDateForUpdate(exit_sector)
            if (formattedExitSector) {
                updateFields.saida_setor = formattedExitSector
            } else {
                throw new Error('Data de saída inválida')
            }
        }

        if (equipment && equipment !== active.equipamento) {
            updateFields.equipamento = equipment
        }

        if (identification_code && identification_code !== active.codigo_identificacao) {
            updateFields.codigo_identificacao = identification_code
        }

        if (delivery_forecast && delivery_forecast !== active.previsao_entrega) {
            const formattedDeliveryForecast = notice.formatDateForUpdate(delivery_forecast)
            if (formattedDeliveryForecast) {
                updateFields.previsao_entrega = formattedDeliveryForecast
            } else {
                throw new Error('Data de entrega prevista inválida')
            }
        }

        if (delivered !== undefined && delivered !== active.entregue) {
            updateFields.entregue = delivered
        }

        const updateParams = []
        let updateQuery = 'UPDATE kian_emprestimos SET '

        for (const field in updateFields) {
            updateQuery += `${field} = ?, `
            updateParams.push(updateFields[field])
        }

        updateQuery = updateQuery.slice(0, -2)
        updateQuery += ' WHERE id = ?'
        updateParams.push(id)

        await inventoryDatabase.pool.execute(updateQuery, updateParams)

        res.json({ success: true, message: "Empréstimo Alterado" })
    } catch (error) {
        console.error('Erro ao atualizar registro:', error)
        res.render('error', { error: 'Erro ao atualizar registro' })
    }
}

const exportInventoryToExcel = async (req, res) => {
    try {
        if (req.session && req.session.username) {
            const { searchChar, searchField, startDate, endDate } = req.query

            let query = 'SELECT * FROM kian_emprestimos WHERE 1=1'
            let queryParams = []

            if (searchChar && searchField) {
                query += ` AND ${searchField} LIKE ?`
                queryParams.push(`%${searchChar}%`)
            }

            if (startDate) {
                query += ' AND dt_finalizacao >= ?'
                queryParams.push(startDate)
            }

            if (endDate) {
                query += ' AND dt_finalizacao <= ?'
                queryParams.push(endDate)
            }

            const [rows] = await inventoryDatabase.pool.execute(query, queryParams)
            const userData = await inventoryDatabase.getUserByUsername(req.session.username)

            if (userData.cargo === 'Administrador') {
                const actives = rows.map(active => ({
                    'Identificação da Solicitação': active.id,
                    'Responsável pelo Empréstimo': active.responsavel_emprestimo,
                    'Solicitante': active.solicitante,
                    'Saída do Setor': notice.formatDate(new Date(active.saida_setor)),
                    'Equipamento': active.equipamento,
                    'Identificação do Equipamento': active.codigo_identificacao,
                    'Previsão de Entrega': notice.formatDate(new Date(active.previsao_entrega)),
                    'Solicitação Entregue': active.entregue,
                    'Responsável por Finalizar Solicitação': active.finalizacao_emprestimo ? active.finalizacao_emprestimo : 'Pendente',
                    'Data da Finalização da Solicitação': active.dt_finalizacao ? notice.formatDateWithCheck(active.dt_finalizacao) : 'Pendente'
                }))

                spreadsheet.exportToExcel(actives, res, { searchChar, searchField, startDate, endDate })
            } else {
                res.send('Usuário sem permissão')
            }
        } else {
            res.redirect('/')
        }
    } catch (error) {
        res.render('error', { error: 'Erro ao obter dados do inventário' })
    }
}

const inventoryRequests = async (req, res) => {
    try {
        if (req.session && req.session.username) {
            const [rows] = await inventoryDatabase.pool.execute('SELECT * FROM KIAN_SOLICITACOES;')
            const userData = await inventoryDatabase.getUserByUsername(req.session.username)

            if (rows && userData.cargo === 'Administrador') {
                const actives = rows.map(active => ({
                    id: active.id,
                    requester: active.solicitante,
                    exit_sector: notice.formatDate(new Date(active.saida_setor)),
                    equipment: active.equipamento,
                    identification_code: active.codigo_identificacao,
                    delivery_forecast: notice.formatDate(new Date(active.previsao_entrega)), 
                    loan_reason: active.motivo_emprestimo,
                    request_status: active.status_solicitacao
                }))

                res.render('inventory_requests', { actives })
            } else {
                res.send('Usuário sem permissão')
            }
        } else {
            res.redirect('/')
        }
    } catch (error) {
        res.render('error', { error: 'Erro ao obter dados do inventário' })
    }
}

const inventoryListAllRequests = async (req, res) => {
    try {
        if (req.session && req.session.username) {
            const { searchChar, searchField, startDate, endDate } = req.query

            let query = 'SELECT * FROM kian_solicitacoes WHERE 1=1'
            let queryParams = []

            if (searchChar && searchField) {
                query += ` AND ${searchField} LIKE ?`
                queryParams.push(`%${searchChar}%`)
            }

            if (startDate) {
                query += ' AND dt_finalizacao >= ?'
                queryParams.push(startDate)
            }

            if (endDate) {
                query += ' AND dt_finalizacao <= ?'
                queryParams.push(endDate)
            }

            const [rows] = await inventoryDatabase.pool.execute(query, queryParams)
            const userData = await inventoryDatabase.getUserByUsername(req.session.username)

            if (rows && userData.cargo === 'Administrador') {
                const actives = rows.map(active => ({
                    id: active.id,
                    requester: active.solicitante,
                    exit_sector: notice.formatDate(new Date(active.saida_setor)),
                    equipment: active.equipamento,
                    identification_code: active.codigo_identificacao,
                    delivery_forecast: notice.formatDate(new Date(active.previsao_entrega)),
                    delivered: active.entregue,
                    loan_completed: active.finalizacao_emprestimo,
                    completion_date: notice.formatDateWithCheck(active.dt_finalizacao)
                }))

                res.render('inventory_allrequests', { actives, searchField, searchChar, startDate, endDate })
            } else {
                res.send('Usuário sem permissão')
            }
        } else {
            res.redirect('/')
        }
    } catch (error) {
        res.render('error', { error: 'Erro ao obter dados do inventário' })
    }
}

const inventoryListAllLoans = async (req, res) => {
    try {
        if (req.session && req.session.username) {
            const { searchChar, searchField, startDate, endDate } = req.query

            let query = 'SELECT * FROM kian_emprestimos WHERE 1=1'
            let queryParams = []

            if (searchChar && searchField) {
                query += ` AND ${searchField} LIKE ?`
                queryParams.push(`%${searchChar}%`)
            }

            if (startDate) {
                query += ' AND dt_finalizacao >= ?'
                queryParams.push(startDate)
            }

            if (endDate) {
                query += ' AND dt_finalizacao <= ?'
                queryParams.push(endDate)
            }

            const [rows] = await inventoryDatabase.pool.execute(query, queryParams)
            const userData = await inventoryDatabase.getUserByUsername(req.session.username)

            if (rows && userData.cargo === 'Administrador') {
                const actives = rows.map(active => ({
                    id: active.id,
                    responsible_loan: active.responsavel_emprestimo,
                    requester: active.solicitante,
                    exit_sector: notice.formatDate(new Date(active.saida_setor)),
                    equipment: active.equipamento,
                    identification_code: active.codigo_identificacao,
                    delivery_forecast: notice.formatDate(new Date(active.previsao_entrega)),
                    delivered: active.entregue,
                    loan_completed: active.finalizacao_emprestimo,
                    completion_date: notice.formatDateWithCheck(active.dt_finalizacao)
                }))

                res.render('inventory_allloans', { actives, searchField, searchChar, startDate, endDate })
            } else {
                res.send('Usuário sem permissão')
            }
        } else {
            res.redirect('/')
        }
    } catch (error) {
        res.render('error', { error: 'Erro ao obter dados do inventário' })
    }
}

const inventoryItemDelivered = async (req, res) => {
    try {
        if (req.session && req.session.username) {
            const itemId = req.params.id

            if (!itemId) return res.status(400).send('ID do item não fornecido')

            const userData = await inventoryDatabase.getUserByUsername(req.session.username)

            const currentDate = new Date()
            const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ')

            const updateLoanQuery = 'UPDATE kian_emprestimos SET finalizacao_emprestimo = ?, dt_finalizacao = ?, entregue = ? WHERE id = ?'
            await inventoryDatabase.pool.execute(updateLoanQuery, [userData.nome, formattedDate, true, itemId])

            const itemInfoQuery = 'SELECT solicitante, equipamento, codigo_identificacao FROM kian_emprestimos WHERE id = ?'
            const [itemRows] = await inventoryDatabase.pool.query(itemInfoQuery, [itemId])
            const item = itemRows[0]

            if (item && item.codigo_identificacao) {
                const updateInventoryQuery = 'UPDATE kian_estoque SET emprestado = 0 WHERE codigo_identificacao = ?'
                await inventoryDatabase.pool.execute(updateInventoryQuery, [item.codigo_identificacao])
            } else {
                throw new Error('Código de identificação do item não encontrado.');
            }

            await notice.sendDeliveryConfirmationEmail('raphael.sousa@kian.com.br', itemId, userData.nome, item.equipamento, item.solicitante, formattedDate)

            res.json({ success: true, message: "Empréstimo Finalizado" })
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
    const { responsible_loan, requester, exit_sector, equipment, request_reason, identification_code, delivery_forecast } = req.body
    try {
        const insert = 'INSERT INTO kian_emprestimos(responsavel_emprestimo, solicitante, saida_setor, equipamento, motivo_emprestimo, codigo_identificacao, previsao_entrega) VALUES(?,?, ?, ?, ?, ?, ?)'
        await inventoryDatabase.pool.execute(insert, [responsible_loan, requester, exit_sector, equipment, request_reason, identification_code, delivery_forecast])

        res.json({ success: true, message: "Empréstimo Registrado" })
    } catch (error) {
        res.status(500).send('Erro interno ao enviar registro')
    }
}

const getMenuInventory = async (req, res) => {
    try {
        if (req.session && req.session.username) {
            const username = req.session.username

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

module.exports = {
    inventory,
    getMenuInventory,
    inventoryRequests,
    inventoryAcceptItem,
    inventoryRefuseItem,
    inventoryRequestLoan,
    inventoryRegistration,
    inventoryRegisterItem,
    inventoryItemDelivered,
    inventoryListAllLoans,
    inventoryListAllRequests,
    inventoryChangeItem,
    inventoryUpdateRecord,
    exportInventoryToExcel,
    logout
}