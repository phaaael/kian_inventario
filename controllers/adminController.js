const adminDatabase = require('../resources/database')
const dateUtils = require('../resources/dateUtils')

const userManagement = async (req, res) => {
    try {
        if (req.session && req.session.username) {
            const userData = await adminDatabase.getUserByUsername(req.session.username)
            if (!userData || userData.cargo !== 'Administrador') return res.status(403).json({ success: false, message: 'Usuário sem permissão' })

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

            if (!userData || userData.cargo !== 'Administrador') return res.status(403).json({ success: false, message: 'Usuário sem permissão' });

            res.render('admin/user-creation')
        } else {
            res.redirect('/')
        }
    } catch (error) {
        res.render('error', { error: 'Erro ao obter dados de criação do usuário' })
    }
}

const userCreation = async (req, res) => {
    const { registration, username, password, password_validation, name, email, sector } = req.body
    try {
        if (req.session && req.session.username) {
            const userData = await adminDatabase.getUserByUsername(req.session.username)

            if (!userData || userData.cargo !== 'Administrador') return res.status(403).json({ success: false, message: 'Usuário sem permissão' })
            if (password !== password_validation) return res.json({ success: false, message: "As senhas não coincidem" })

            const userExistsQuery = 'SELECT * FROM kian_usuarios WHERE usuario = ? OR matricula = ?'
            const [existingUsers] = await adminDatabase.pool.execute(userExistsQuery, [username, registration])
            if (existingUsers.length > 0) {
                return res.json({ success: false, message: "Usuário já registrado" })
            }

            const charge_default = 'Membro'

            const insert = 'INSERT INTO kian_usuarios(matricula, usuario, senha, email, nome, setor, cargo ) VALUES(?, ?, ?, ?, ?, ?, ?)'
            await adminDatabase.pool.execute(insert, [registration, username, password, email, name, sector, charge_default])

            res.json({ success: true, message: 'Usuário Registrado com Sucesso' });
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
            if (!userData || userData.cargo !== 'Administrador') return res.status(403).json({ success: false, message: 'Usuário sem permissão' });

            let query = 'SELECT * FROM kian_suprimentos WHERE 1=1'
            const [rows] = await adminDatabase.pool.execute(query)

            if (rows && userData.cargo === 'Administrador') {
                const actives = rows.map(active => ({
                    id: active.id,
                    item: active.item,
                    qtd_item: active.qtd_item,
                    qtd_critica: active.qtd_critica
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
            if (!userData || userData.cargo !== 'Administrador') {
                return res.status(403).json({ success: false, message: 'Usuário sem permissão' });
            }

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

const supplyEntry = async (req, res) => {
    try {
        const itemId = req.params.id
        const quantityToAdd = parseInt(req.body.quantity)

        const userData = await adminDatabase.getUserByUsername(req.session.username)

        if (!userData || userData.cargo !== 'Administrador') return res.status(403).json({ success: false, message: 'Usuário sem permissão' })

        if (!itemId) return res.status(400).json({ success: false, message: 'ID do item não fornecido' })

        if (isNaN(quantityToAdd) || quantityToAdd <= 0) return res.status(400).json({ success: false, message: 'Quantidade inválida' })

        const itemData = await adminDatabase.getItemById(itemId)
        if (!itemData) return res.status(404).json({ success: false, message: 'Item não encontrado' })

        const updatedInventory = itemData.qtd_item + quantityToAdd
        await adminDatabase.updateItemQuantity(itemId, updatedInventory)

        res.json({ success: true, message: 'Estoque atualizado com sucesso', data: { itemId: itemId, newQuantity: updatedInventory } })
    } catch (error) {
        console.error('Erro ao processar entrada de estoque:', error)
        res.status(500).json({ success: false, message: 'Erro ao processar entrada de estoque' })
    }
}

const supplyEntryOfRequest = async (req, res) => {
    try {
        const itemId = req.params.id
        const quantityToAdd = parseInt(req.body.quantity)

        const userData = await adminDatabase.getUserByUsername(req.session.username)
        const currentDate = new Date()
        const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ')

        if (!userData || userData.cargo !== 'Administrador') {
            return res.status(403).json({ success: false, message: 'Usuário sem permissão' })
        }

        if (!itemId) {
            return res.status(400).json({ success: false, message: 'ID do item não fornecido' })
        }

        if (isNaN(quantityToAdd) || quantityToAdd <= 0) {
            return res.status(400).json({ success: false, message: 'Quantidade inválida' })
        }

        const updateReq = 'UPDATE kian_reqsuprimentos SET status_entrega = ?, dt_entrega = ? WHERE id = ?'
        await adminDatabase.pool.execute(updateReq, [1, formattedDate, itemId])

        const selectSupply = 'SELECT suprimento FROM kian_reqsuprimentos WHERE id = ?'
        const [supplyResult] = await adminDatabase.pool.execute(selectSupply, [itemId])

        if (supplyResult.length === 0) {
            return res.status(404).json({ success: false, message: 'Item não encontrado' })
        }

        const supply = supplyResult[0].suprimento

        const selectQuantitySupply = 'SELECT qtd_item FROM kian_suprimentos WHERE item = ?'
        const [quantitySupplyResult] = await adminDatabase.pool.execute(selectQuantitySupply, [supply])

        if (quantitySupplyResult.length === 0) {
            return res.status(404).json({ success: false, message: 'Suprimento não encontrado' })
        }

        const currentQuantity = quantitySupplyResult[0].qtd_item
        const updatedInventory = currentQuantity + quantityToAdd

        const updateResult = await adminDatabase.updateItemQuantityByName(supply, updatedInventory)

        if (!updateResult) {
            return res.status(500).json({ success: false, message: 'Erro ao atualizar o estoque' })
        }

        res.json({ success: true, message: 'Estoque atualizado com sucesso', data: { itemId: itemId, newQuantity: updatedInventory } })
    } catch (error) {
        console.error('Erro ao processar entrada de estoque:', error)
        res.status(500).json({ success: false, message: 'Erro ao processar entrada de estoque' })
    }
}

const changingCriticalQuantity = async (req, res) => {
    try {
        const itemId = req.params.id
        const quantity = parseInt(req.body.quantity)

        const userData = await adminDatabase.getUserByUsername(req.session.username)

        if (!userData || userData.cargo !== 'Administrador') return res.status(403).json({ success: false, message: 'Usuário sem permissão' })

        if (!itemId) return res.status(400).json({ success: false, message: 'ID do item não fornecido' })

        if (isNaN(quantity) || quantity <= 0) return res.status(400).json({ success: false, message: 'Quantidade inválida' })

        const itemData = await adminDatabase.getItemById(itemId)
        if (!itemData) return res.status(404).json({ success: false, message: 'Item não encontrado' })
        
        const updatedInventory = quantity
        await adminDatabase.updateItemQuantityCritical(itemId, updatedInventory)
    
        res.json({ success: true, message: 'Estoque atualizado com sucesso', data: { itemId: itemId, newQuantity: updatedInventory } })
    } catch {
        console.error('Erro ao processar manutenção na quantidade crítica:', error)
        res.status(500).json({ success: false, message: 'Erro ao processar manutenção na quantidade crítica' })
    }
}

const requestManagement = async (req, res) => {
    try {
        if (req.session && req.session.username) {
            const userData = await adminDatabase.getUserByUsername(req.session.username)
            if (!userData || userData.cargo !== 'Administrador') return res.status(403).json({ success: false, message: 'Usuário sem permissão' })
            
            let query = 'SELECT * FROM kian_reqsuprimentos WHERE status_entrega = 0'
            const [rows] = await adminDatabase.pool.execute(query)

            if (rows && userData.cargo === 'Administrador') {
                const actives = rows.map(active => ({
                    id: active.id,
                    dt_req: dateUtils.formatDate(active.dt_req),
                    supply: active.suprimento
                }))

                res.render('admin/request-management', { actives })
            } else {
                res.redirect('/')
            }
        }
    } catch {
        res.status(500).json({ success: false, message: 'Erro ao carregar gerenciamento de requisições' })
    }
}

const allRequests = async (req, res) => {
    try {
        if (req.session && req.session.username) {
            const userData = await adminDatabase.getUserByUsername(req.session.username)
            if (!userData || userData.cargo !== 'Administrador') return res.status(403).json({ success: false, message: 'Usuário sem permissão' })
            
            let query = 'SELECT * FROM kian_reqsuprimentos;'
            const [rows] = await adminDatabase.pool.execute(query)

            if (rows && userData.cargo === 'Administrador') {
                const actives = rows.map(active => ({
                    id: active.id,
                    dt_req: dateUtils.formatDate(active.dt_req),
                    supply: active.suprimento,
                    status: active.status_entrega === 0 ? 'Pendente' : 'Entregue',
                    dt_ent: active.dt_entrega ? dateUtils.formatDate(active.dt_entrega) : 'Pendente'
                }))

                res.render('admin/all-requests', { actives })
            } else {
                res.redirect('/')
            }
        }
    } catch {
        res.status(500).json({ success: false, message: 'Erro ao carregar gerenciamento de requisições' })
    }
}

module.exports = {
    userManagement,
    userCreation,
    getUserCreation,
    supplyEntryOfRequest,
    equipmentManagement,
    changingCriticalQuantity,
    supplyEntry,
    requestManagement,
    allRequests,
    supplyManagement
}