const inventoryDatabase = require('../resources/database')
const spreadsheet = require('../resources/spreadsheet_export')
const notice = require('../resources/notice')
const dateUtils = require('../resources/dateUtils')

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
                requester: active.requerente,
                exit_sector: dateUtils.formatDate(new Date (active.dt_req)),
                equipment: active.equipamento,
                identification_code: active.codigo_identificacao,
                delivery_forecast: dateUtils.formatDate(new Date (active.previsao_entrega)),
                delivered: active.entregue
            }))

            res.render('inventory/inventory', { actives: actives } )
        } else {
            res.send('Usuário sem permissão')
        }
    } catch (error) {
        res.render('error', { error: 'Erro ao obter dados do invetario' })
    }
}

const inventoryAllSupplements = async (req, res) => {
    try {
        if (req.session && req.session.username) {
            const userData = await inventoryDatabase.getUserByUsername(req.session.username)
            if (!userData || userData.cargo !== 'Administrador') return res.send('Usuário sem permissão')

            const { searchChar, searchField, startDate, endDate } = req.query

            const allowedFields = [ 'id', 'requerente', 'equipamento' ]

            let query = `SELECT * FROM kian_solicitacoes WHERE tipo = 'Suprimento' `
            let queryParams = []

            if (searchChar && allowedFields.includes(searchField)) {
                query += ` AND ${searchField} LIKE ?`
                queryParams.push(`%${searchChar}%`)
            }

            if (startDate) {
                query += ' AND dt_req >= ?'
                queryParams.push(startDate)
            }
            
            if (endDate) {
                query += ' AND dt_req <= ?'
                queryParams.push(endDate)
            }

            const [rows] = await inventoryDatabase.pool.execute(query, queryParams)

            const actives = rows.map(active => ({
                id: active.id,
                requester: active.requerente,
                exit_sector: dateUtils.formatDate(new Date(active.dt_req)),
                equipment: active.equipamento,
                reason_refusal: active.motivo_recusa,
                supplement_reason: active.motivo,
                request_status: active.status_solicitacao,
                response_completion: active.tec_responsavel ? active.tec_responsavel : 'Pendente',
                end_date: active.dt_finalizacao ? dateUtils.formatDateWithCheck(active.dt_finalizacao) : 'Pendente'
            }))

            res.render('inventory/all-supplements', { actives, searchField, searchChar, startDate, endDate })
        } else {
            res.redirect('/')
        }
    } catch (error) {
        res.render('error', { error: 'Erro ao obter dados do inventário' })
    }
}

const inventorySupplements = async (req, res) => {
    try {
        if (req.session && req.session.username) {
            const userData = await inventoryDatabase.getUserByUsername(req.session.username)
            if (!userData || userData.cargo !== 'Administrador') {
                return res.send('Usuário sem permissão')
            }

            const { searchChar, searchField, startDate, endDate } = req.query

            const allowedFields = ['id', 'requerente', 'equipamento']

            // let query = 'SELECT * FROM kian_solicitacoes_suprimentos WHERE 1=1'
            let query = `SELECT * FROM kian_solicitacoes WHERE tipo = 'Suprimento' `
            let queryParams = []

            if (searchChar && allowedFields.includes(searchField)) {
                query += ` AND ${searchField} LIKE ?`
                queryParams.push(`%${searchChar}%`)
            }

            if (startDate) {
                query += ' AND dt_req >= ?'
                queryParams.push(startDate)
            }
            
            if (endDate) {
                query += ' AND dt_req <= ?'
                queryParams.push(endDate)
            }

            const [rows] = await inventoryDatabase.pool.execute(query, queryParams)

            const actives = rows.map(active => ({
                id: active.id,
                requester: active.requerente,
                exit_sector: dateUtils.formatDate(new Date(active.dt_req)),
                equipment: active.equipamento,
                supplement_reason: active.motivo,
                request_status: active.status_solicitacao,
                response_completion: active.tec_responsavel,
                end_date: dateUtils.formatDate(new Date(active.dt_finalizacao))
            }))

            res.render('inventory/supplements', { actives, searchField, searchChar, startDate, endDate })
        } else {
            res.redirect('/')
        }
    } catch (error) {
        res.render('error', { error: 'Erro ao obter dados do inventário' })
    }
}

const inventoryRequestSupplement = async (req, res) => {
    try {
        if (req.method === 'GET') {
            const itemQuery = 'SELECT item, qtd_item FROM kian_suprimentos'
            const [items] = await inventoryDatabase.pool.execute(itemQuery)
            res.render('inventory/request-supplement', { items })
        } else if (req.method === 'POST') {
            const { exit_sector, item, request_reason } = req.body
            const userData = await inventoryDatabase.getUserByUsername(req.session.username)

            if (!userData || !userData.nome) { throw new Error('Usuário não encontrado ou não logado') }

            const itemQuery = 'SELECT item, qtd_item FROM kian_suprimentos WHERE item = ?'
            const [[{ item: itemName, qtd_item: itemQuantity }]] = await inventoryDatabase.pool.execute(itemQuery, [item])

            if (!itemName) { throw new Error('Item não encontrado.') }
            if (itemQuantity <= 0) { throw new Error('Estoque insuficiente.') }

            const insertQuery = `
                INSERT INTO kian_solicitacoes(requerente, tipo, dt_req, equipamento, motivo)
                VALUES (?, ?, ?, ?, ?)
            `
            const tipo = "Suprimento"
        
            const [ insertResult ] = await inventoryDatabase.pool.execute(insertQuery, [userData.nome, tipo ,exit_sector, itemName, request_reason])
            const insertedId = insertResult.insertId

            res.json({ success: true, message: "Requemento de Suprimento Enviada" })

            // await notice.requestConfirmationSupplement(userData.email, insertedId, userData.nome)
        }
    } catch (error) {
        console.error(error)
        res.render('error', { error: 'Erro ao solicitar suprimento: ' + error.message })
    }
}

const inventoryRequestLoan = async (req, res) => {
    try {
        if (req.method === 'GET') {
            const query = `
                        SELECT kian_equipamentos.*
                        FROM kian_equipamentos
                        LEFT JOIN kian_solicitacoes ON kian_equipamentos.id = kian_solicitacoes.equipamento
                        AND kian_solicitacoes.status_solicitacao IS NULL
                        WHERE kian_equipamentos.emprestado = 0 AND kian_solicitacoes.equipamento IS NULL;
            `
            
            const [row] = await inventoryDatabase.pool.execute(query)
            res.render('inventory/request-loan', { row })
        } else if (req.method === 'POST') {
            const { exit_sector, item, request_reason, delivery_forecast } = req.body
            const userData = await inventoryDatabase.getUserByUsername(req.session.username)

            if (!userData || !userData.nome) { throw new Error('Usuário não encontrado ou não logado') }

            const itemQuery = 'SELECT item, codigo_identificacao FROM kian_equipamentos WHERE id = ?'
            const [[{ item: itemName, codigo_identificacao: codigoId }]] = await inventoryDatabase.pool.execute(itemQuery, [item])

            if (!itemName || !codigoId) { throw new Error('Item ou Código de Identificação não encontrado.') }
            
            const tipo = 'Equipamento'
            const insertQuery = `
                INSERT INTO kian_solicitacoes (requerente, tipo, dt_req, equipamento, codigo_identificacao, motivo, previsao_entrega)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `
            
            const [ insertResult ] = await inventoryDatabase.pool.execute(insertQuery, [userData.nome, tipo, exit_sector, itemName, codigoId, request_reason, delivery_forecast])
            const insertedId = insertResult.insertId

            const updateQuery = 'UPDATE kian_equipamentos SET emprestado = 1 WHERE id = ?'
            await inventoryDatabase.pool.execute(updateQuery, [item])
            
            res.json({ success: true, message: "Requerimento de Empréstimo Enviada" })

            // await notice.requestConfirmation(userData.email, insertedId, userData.nome)
        }
    } catch (error) {
        console.error(error)
        res.render('error', { error: 'Erro ao solicitar equipamento: ' + error.message })
    }
}

const inventoryAcceptSupplement = async (req, res) => {
    try {
        const itemId = req.params.id
        const userData = await inventoryDatabase.getUserByUsername(req.session.username)

        if (!itemId) return res.status(400).json({ success: false, message: 'ID de requerimento não fornecido' })

        const currentDate = new Date()
        const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ')

        const updateQuery = 'UPDATE kian_solicitacoes SET status_solicitacao = ?, tec_responsavel = ?, dt_finalizacao = ? WHERE id = ?'
        const [updateResult] = await inventoryDatabase.pool.execute(updateQuery, [true, userData.nome, formattedDate, itemId])

        if (updateResult.affectedRows > 0) {
            const itemNameQuery = 'SELECT equipamento FROM kian_solicitacoes WHERE id = ?'
            const [[itemNameResult]] = await inventoryDatabase.pool.execute(itemNameQuery, [itemId])
            if (!itemNameResult) return res.status(404).json({ success: false, message: 'Nome do item não encontrado' })

            const updateStock = 'UPDATE kian_suprimentos SET qtd_item = qtd_item - 1 WHERE item = ?'
            await inventoryDatabase.pool.execute(updateStock, [itemNameResult.equipamento])

            const selectQuery = 'SELECT requerente, dt_req, equipamento, motivo FROM kian_solicitacoes WHERE id = ?'
            const [rows] = await inventoryDatabase.pool.execute(selectQuery, [itemId])

            if (rows.length > 0) {
                const supplement = rows[0]
                const userEmailQuery = 'SELECT email FROM kian_usuarios WHERE nome = ?'
                const [[userEmail]] = await inventoryDatabase.pool.execute(userEmailQuery, [supplement.requerente])

                // await notice.requestApprovedSupplement(userEmail.email, supplement.requerente, itemId, userData.nome)

                res.json({ success: true, message: "Requerimento Aceito" })
            } else {
                res.status(404).json({ success: false, message: 'Nenhum registro encontrado para atualizar' })
            }
        } else {
            res.status(404).json({ success: false, message: 'Atualização de requerimento falhou' })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: 'Erro ao aceitar requerimento' })
    }
}


const inventoryAcceptItem = async (req, res) => {
    try {
        const itemId = req.params.id
        const userData = await inventoryDatabase.getUserByUsername(req.session.username)

        if (!itemId) return res.status(400).json({ success: false, message: 'ID do item não fornecido' })

        const updateQuery = 'UPDATE kian_solicitacoes SET status_solicitacao = ?, tec_responsavel = ? WHERE id = ?'
        const [updateResult] = await inventoryDatabase.pool.execute(updateQuery, [true, userData.nome, itemId])

        if (updateResult.affectedRows > 0) {
            const selectQuery = `SELECT requerente, dt_req, equipamento, codigo_identificacao, motivo, previsao_entrega FROM kian_solicitacoes WHERE id = ?`
            const [rows] = await inventoryDatabase.pool.execute(selectQuery, [itemId])

            if (rows.length > 0) {
                const loan = rows[0]

                const userEmailQuery = `SELECT email FROM kian_usuarios WHERE nome = ?`
                const [[userEmail]] = await inventoryDatabase.pool.execute(userEmailQuery, [loan.requerente])

                const insertQuery = `INSERT INTO kian_emprestimos (responsavel_emprestimo, requerente, dt_req, equipamento, codigo_identificacao, motivo, previsao_entrega) VALUES (?, ?, ?, ?, ?, ?, ?)`
                await inventoryDatabase.pool.execute(insertQuery, [userData.nome, loan.requerente, loan.dt_req, loan.equipamento, loan.codigo_identificacao, loan.motivo, loan.previsao_entrega])
                
                // await notice.requestApproved(userEmail.email, loan.requerente, itemId, userData.nome)
                
                res.json({ success: true, message: "Requerimento Aceito" })
            } else {
                res.status(404).json({ success: false, message: 'Nenhum registro encontrado para atualizar' })
            }
        } else {
            res.status(404).json({ success: false, message: 'Atualização de requerimento falhou' })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: 'Erro ao aceitar requerimento' })
    }
}

const inventoryRefuseSupplement = async (req, res) => {
    try {
        const itemId = req.params.id
        const reason = req.body.reason
        const userData = await inventoryDatabase.getUserByUsername(req.session.username)

        if (!itemId) return res.status(400).json({ success: false, message: 'ID do item não fornecido' })

        const currentDate = new Date()
        const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ')

        const updateQuery = 'UPDATE kian_solicitacoes SET status_solicitacao = ?, solicitacao_recusada = ?, motivo_recusa = ?, tec_responsavel = ?, dt_finalizacao = ? WHERE id = ?'
        const [updateResult] = await inventoryDatabase.pool.execute(updateQuery, [true, true, reason, userData.nome, formattedDate, itemId])

        if (updateResult.affectedRows > 0) {
            const selectQuery = `SELECT requerente, dt_req, equipamento, motivo FROM kian_solicitacoes WHERE id = ?`
            const [rows] = await inventoryDatabase.pool.execute(selectQuery, [itemId])

            if (rows.length > 0) {
                const supplement = rows[0]

                const userEmailQuery = `SELECT email FROM kian_usuarios WHERE nome = ?`
                const [[userEmail]] = await inventoryDatabase.pool.execute(userEmailQuery, [supplement.requerente])
                
                // await notice.requestRefusedSupplement(userEmail.email, supplement.requerente, reason, itemId, userData.nome)
                
                res.json({ success: true, message: "Requerimento Recusado" })
            } else {
                res.status(404).json({ success: false, message: 'Nenhum registro encontrado para atualizar' })
            }
        } else {
            res.status(404).json({ success: false, message: 'Atualização de requerimento falhou' })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: 'Erro ao aceitar requerimento' })
    }
}

const inventoryRefuseItem = async (req, res) => {
    try {
        const itemId = req.params.id
        const reason = req.body.reason
        const userData = await inventoryDatabase.getUserByUsername(req.session.username)

        if (!itemId) return res.status(400).json({ success: false, message: 'ID do item não fornecido' })

        if (!reason) return res.status(400).json({ success: false, message: 'Motivo da recusa não fornecido' })

        const updateQuery = 'UPDATE kian_solicitacoes SET status_solicitacao = ?, solicitacao_recusada = ?, motivo_recusa = ? WHERE id = ?'
        await inventoryDatabase.pool.execute(updateQuery, [true, true, reason, itemId])

        const itemInfoQuery = 'SELECT requerente, equipamento, codigo_identificacao FROM kian_solicitacoes WHERE id = ?'
        const [itemRows] = await inventoryDatabase.pool.query(itemInfoQuery, [itemId])
        const item = itemRows[0]

        if (!item || !item.codigo_identificacao) {
            return res.status(404).json({ success: false, message: 'Código de identificação do item não encontrado.' })
        }

        const updateInventoryQuery = 'UPDATE kian_equipamentos SET emprestado = 0 WHERE codigo_identificacao = ?'
        await inventoryDatabase.pool.execute(updateInventoryQuery, [item.codigo_identificacao])

        const userEmailQuery = 'SELECT email FROM kian_usuarios WHERE nome = ?'
        const [userRows] = await inventoryDatabase.pool.query(userEmailQuery, [item.requerente])
        const user = userRows[0]

        if (!user || !user.email) {
            return res.status(404).json({ success: false, message: 'E-mail do requerente não encontrado.' })
        }

        res.json({ success: true, message: "Requerimento Recusado" })

        // await notice.requestRefused(user.email, item.requerente, reason, itemId, userData.nome)
    } catch (error) {
        console.error('Erro ao recusar requerimento:', error)
        res.status(500).json({ success: false, message: 'Erro ao recusar requerimento' })
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
                requester: active.requerente,
                exit_sector: dateUtils.formatDate(new Date(active.dt_req)),
                equipment: active.equipamento,
                identification_code: active.codigo_identificacao,
                delivery_forecast: active.previsao_entrega,
                delivered: active.entregue,
                loan_completed: active.tec_responsavel,
                completion_date: dateUtils.formatDateWithCheck(active.dt_finalizacao)
            }

            res.render('inventory/change-item', { active: activeData, formatDateForInput: dateUtils.formatDateForInput })
        } else {
            res.send('Usuário sem permissão ou item não encontrado')
        }
  
    } catch (error) {
        res.render('error', { error: 'Erro ao carregar dados para alteração' })
    }
}

const inventoryUpdateRecord = async (req, res) => {
    try {
        const { id, responsible_loan, requester, exit_sector, equipment, identification_code, delivery_forecast, delivered, email } = req.body

        const userData = await inventoryDatabase.getUserByUsername(req.session.username)

        const [rows] = await inventoryDatabase.pool.query('SELECT * FROM kian_emprestimos WHERE id = ?', [id])
        const active = rows[0]

        const updateFields = {}
        let fieldsChanged = false

        if (responsible_loan && responsible_loan !== active.responsavel_emprestimo) {
            updateFields.responsavel_emprestimo = responsible_loan
            fieldsChanged = true
        }

        if (requester && requester !== active.requerente) {
            updateFields.requerente = requester
            fieldsChanged = true
        }

        if (exit_sector) {
            const formattedExitSector = dateUtils.formatDateForUpdate(exit_sector)
            const currentExitSector = dateUtils.formatDateForUpdate(active.dt_req)
            if (formattedExitSector !== currentExitSector) {
                updateFields.dt_req = formattedExitSector
                fieldsChanged = true
            }
        }

        if (equipment && equipment !== active.equipamento) {
            updateFields.equipamento = equipment
            fieldsChanged = true
        }

        if (identification_code && identification_code !== active.codigo_identificacao) {
            updateFields.codigo_identificacao = identification_code
            fieldsChanged = true
        }

        if (delivery_forecast) {
            const formattedDeliveryForecast = dateUtils.formatDateForUpdate(delivery_forecast)
            const currentDeliveryForecast = dateUtils.formatDateForUpdate(active.previsao_entrega)
            if (formattedDeliveryForecast !== currentDeliveryForecast) {
                updateFields.previsao_entrega = formattedDeliveryForecast
                fieldsChanged = true
            }
        }

        if (delivered !== undefined && delivered !== active.entregue) {
            updateFields.entregue = delivered
            fieldsChanged = true
        }

        const userEmailQuery = 'SELECT email FROM kian_usuarios WHERE nome = ?'
        const [userEmailRows] = await inventoryDatabase.pool.query(userEmailQuery, [requester])
        const userEmail = userEmailRows[0]?.email

        if (!userEmail) throw new Error('E-mail do requerente não encontrado.')

        if (fieldsChanged) {
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

            res.json({ success: true, message: "Empréstimo alterado com sucesso" })
            
            const fieldNamesMap = { dt_req: 'Data de Requisição', codigo_identificacao: 'Código de Identificação', previsao_entrega: 'Previsão de Entrega' }
            
            const dateFields = new Set(['dt_req', 'previsao_entrega'])

            const changesDescription = Object.entries(updateFields)
                .map(([field, value]) => {
                    const readableName = fieldNamesMap[field] || field
                    const formattedValue = dateFields.has(field) ? dateUtils.formatDateForUpdateRecord(value) : value
                    return `${readableName}: ${formattedValue}`
                })
                .join('\n')
            await notice.updateRecord(userEmail, requester, changesDescription, id, userData.nome)
        } else {
            res.json({ success: false, message: "Nenhuma alteração detectada" })
        }
    } catch (error) {
        console.error('Erro ao atualizar registro:', error)
        res.status(500).render('error', { error: 'Erro ao atualizar registro' })
    }
}

const exportInventoryListAllLoans = async (req, res) => {
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
                    'Identificação de Requerimento': active.id,
                    'Responsável pelo Empréstimo': active.responsavel_emprestimo,
                    'Requerente': active.requerente,
                    'Data da Requisição': dateUtils.formatDate(new Date(active.dt_req)),
                    'Equipamento': active.equipamento,
                    'Identificação do Equipamento': active.codigo_identificacao,
                    'Previsão de Entrega': dateUtils.formatDate(new Date(active.previsao_entrega)),
                    'Requerimento Entregue': active.entregue,
                    'Responsável por Finalizar Requerimento': active.tec_responsavel ? active.tec_responsavel : 'Pendente',
                    'Data da Finalização do Requerimento': active.dt_finalizacao ? dateUtils.formatDateWithCheck(active.dt_finalizacao) : 'Pendente'
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

const exportinventoryListAllSupplements = async (req, res) => {
    try {
        if (req.session && req.session.username) {
            const { searchChar, searchField, startDate, endDate } = req.query

            // let query = 'SELECT * FROM kian_solicitacoes_suprimentos WHERE 1=1'
            let query = `SELECT * FROM kian_solicitacoes WHERE tipo = 'Suprimento' `
            let queryParams = []

            if (searchChar && searchField) {
                query += ` AND ${searchField} LIKE ?`
                queryParams.push(`%${searchChar}%`)
            }

            if (startDate) {
                query += ' AND dt_req >= ?'
                queryParams.push(startDate)
            }

            if (endDate) {
                query += ' AND dt_req <= ?'
                queryParams.push(endDate)
            }

            const [rows] = await inventoryDatabase.pool.execute(query, queryParams)
            const userData = await inventoryDatabase.getUserByUsername(req.session.username)

            if (userData.cargo === 'Administrador') {
                const actives = rows.map(active => ({
                    'Identificação de Requerimento': active.id,
                    'Requerente': active.requerente,
                    'Data da Requisição': dateUtils.formatDate(new Date(active.dt_req)),
                    'Equipamento': active.equipamento,
                    'Motivo do Requerimento': active.motivo,
                    'Responsável por Finalizar Requerimento': active.tec_responsavel ? active.tec_responsavel : 'Pendente',
                    'Data da Finalização do Requerimento': active.dt_finalizacao ? dateUtils.formatDateWithCheck(active.dt_finalizacao) : 'Pendente',
                    'Status do Requerimento': (active.status_solicitacao === 0 && (!active.motivo_recusa || active.motivo_recusa.trim() === '')) ? 'Requerimento Pendente' :
                    (active.status_solicitacao === 1 && (!active.motivo_recusa || active.motivo_recusa.trim() === '')) ? 'Requerimento Aprovado' :
                    (active.status_solicitacao === 1 && active.motivo_recusa && active.motivo_recusa.trim() !== '') ? active.motivo_recusa : active.motivo_recusa
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

const exportinventoryListAllRequests = async (req, res) => {
    try {
        if (req.session && req.session.username) {
            const { searchChar, searchField, startDate, endDate } = req.query

            let query = ` SELECT * FROM kian_solicitacoes WHERE tipo = 'Equipamento' `
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
                    'Identificação do Requerimento': active.id,
                    'Requerente': active.requerente,
                    'Data da Requisição': dateUtils.formatDate(new Date(active.dt_req)),
                    'Equipamento': active.equipamento,
                    'Identificação do Equipamento': active.codigo_identificacao,
                    'Previsão de Entrega': dateUtils.formatDate(new Date(active.previsao_entrega)),
                    'Motivo do Requerimento': active.motivo,
                    'Status do Requerimento': (active.status_solicitacao === 0 && (!active.motivo_recusa || active.motivo_recusa.trim() === '')) ? 'Requerimento Pendente' :
                    (active.status_solicitacao === 1 && (!active.motivo_recusa || active.motivo_recusa.trim() === '')) ? 'Requerimento Aprovado' :
                    (active.status_solicitacao === 1 && active.motivo_recusa && active.motivo_recusa.trim() !== '') ? active.motivo_recusa :
                    'Status Indefinido'                
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
            const userData = await inventoryDatabase.getUserByUsername(req.session.username)
            if (!userData || userData.cargo !== 'Administrador') {
                return res.send('Usuário sem permissão')
            }

            const { searchChar, searchField, startDate, endDate } = req.query

            const allowedFields = ['id', 'requerente', 'equipamento', 'codigo_identificacao']

            let query = ` SELECT * FROM kian_solicitacoes WHERE tipo = 'Equipamento' `
            let queryParams = []

            if (searchChar && allowedFields.includes(searchField)) {
                query += ` AND ${searchField} LIKE ?`
                queryParams.push(`%${searchChar}%`)
            }

            if (startDate) {
                query += ' AND dt_req >= ?'
                queryParams.push(startDate)
            }
            
            if (endDate) {
                query += ' AND dt_req <= ?'
                queryParams.push(endDate)
            }

            const [rows] = await inventoryDatabase.pool.execute(query, queryParams)

            const actives = rows.map(active => ({
                id: active.id,
                requester: active.requerente,
                exit_sector: dateUtils.formatDate(new Date(active.dt_req)),
                equipment: active.equipamento,
                identification_code: active.codigo_identificacao,
                delivery_forecast: dateUtils.formatDate(new Date(active.previsao_entrega)), 
                loan_reason: active.motivo,
                request_status: active.status_solicitacao
            }))

            res.render('inventory/requests', { actives, searchField, searchChar, startDate, endDate })
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

            let query = ` SELECT * FROM kian_solicitacoes WHERE tipo = 'Equipamento' `
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
                    responsible_loan: active.tec_responsavel,
                    requester: active.requerente,
                    exit_sector: dateUtils.formatDate(new Date(active.dt_req)),
                    equipment: active.equipamento,
                    identification_code: active.codigo_identificacao,
                    delivery_forecast: dateUtils.formatDate(new Date(active.previsao_entrega)),
                    delivered: active.entregue,
                    reason: active.motivo,      
                    reason_refusal: active.motivo_recusa,
                    status: active.status_solicitacao
                }))

                res.render('inventory/all-requests', { actives, searchField, searchChar, startDate, endDate })
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
                    requester: active.requerente,
                    exit_sector: dateUtils.formatDate(new Date(active.dt_req)),
                    equipment: active.equipamento,
                    identification_code: active.codigo_identificacao,
                    delivery_forecast: dateUtils.formatDate(new Date(active.previsao_entrega)),
                    delivered: active.entregue,
                    loan_completed: active.tec_responsavel,
                    completion_date: dateUtils.formatDateWithCheck(active.dt_finalizacao)
                }))

                res.render('inventory/all-loans', { actives, searchField, searchChar, startDate, endDate })
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

            const updateLoanQuery = 'UPDATE kian_emprestimos SET tec_responsavel = ?, dt_finalizacao = ?, entregue = ? WHERE id = ?'
            await inventoryDatabase.pool.execute(updateLoanQuery, [userData.nome, formattedDate, true, itemId])

            const itemInfoQuery = 'SELECT requerente, equipamento, codigo_identificacao FROM kian_emprestimos WHERE id = ?'
            const [itemRows] = await inventoryDatabase.pool.query(itemInfoQuery, [itemId])
            const item = itemRows[0]

            if (!item) throw new Error('Informações do item para empréstimo não encontradas.')

            if (item.codigo_identificacao) {
                const updateInventoryQuery = 'UPDATE kian_equipamentos SET emprestado = 0 WHERE codigo_identificacao = ?'
                await inventoryDatabase.pool.execute(updateInventoryQuery, [item.codigo_identificacao])
            } else {
                throw new Error('Código de identificação do item não encontrado.')
            }

            const userEmailQuery = 'SELECT email FROM kian_usuarios WHERE nome = ?'
            const [userEmailRows] = await inventoryDatabase.pool.query(userEmailQuery, [item.requerente])
            const userEmail = userEmailRows[0]?.email

            if (!userEmail) throw new Error('E-mail do requerente não encontrado.')

            // await notice.sendDeliveryConfirmationEmail(userEmail, itemId, userData.nome, item.equipamento, item.requerente, formattedDate, item.codigo_identificacao)

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
            res.render('inventory/registration')
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
        const insert = 'INSERT INTO kian_emprestimos(responsavel_emprestimo, requerente, dt_req, equipamento, motivo, codigo_identificacao, previsao_entrega) VALUES(?,?, ?, ?, ?, ?, ?)'
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

                res.render('inventory/functions', { data: data })
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

const getMyRequirements = async (req, res) => {
    try {
        if (req.session && req.session.username) {
            const userData = await inventoryDatabase.getUserByUsername(req.session.username)

            const requirements = await inventoryDatabase.getRequirements(userData.nome)

            if (requirements) {
                const actives = requirements.map(active => ({
                    id: active.id,
                    requirement: active.requerente,
                    type: active.tipo,
                    dt_req: dateUtils.formatDate(new Date (active.dt_req)),
                    status: (active.status_solicitacao === 1 && active.solicitacao_recusada === 1) ? 'Recusado' : (active.status_solicitacao === 0 ? 'Pendente' : 'Aprovado'),
                    equipament: active.equipamento,
                    identification: active.codigo_identificacao,
                    reason: active.motivo,
                    reason_refusal: active.motivo_recusa,
                    delivery_forecast: dateUtils.formatDate(new Date (active.previsao_entrega)),
                    responsible_technician: active.tec_responsavel ? active.tec_responsavel : 'Pendente',
                    dt_completion: active.dt_finalizacao ? active.dt_finalizacao : 'Pendente'
                }))

                res.render('inventory/my-requirements', { actives })
            } else {
                res.render('error', { error: 'Erro ao carregar seus requerimentos' })
            }
        } else {
            res.redirect('/')
        }
    } catch (error) {
        res.render('error', { error: 'Erro ao obter os requerimentos' })
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
    getMyRequirements,
    inventoryRequests,
    inventoryAcceptSupplement,
    inventoryAcceptItem,
    inventoryRefuseItem,
    inventoryRefuseSupplement,
    inventoryRequestLoan,
    inventoryAllSupplements,
    inventoryRequestSupplement,
    inventorySupplements,
    inventoryRegistration,
    inventoryRegisterItem,
    inventoryItemDelivered,
    inventoryListAllLoans,
    inventoryListAllRequests,
    inventoryChangeItem,
    inventoryUpdateRecord,
    exportInventoryListAllLoans,
    exportinventoryListAllSupplements,
    exportinventoryListAllRequests,
    logout
}