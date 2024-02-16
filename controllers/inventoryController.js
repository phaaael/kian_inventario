const inventoryDatabase = require('../database')

const logout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
          res.status(500).send('Erro ao finalizar sessão')
        } else {
          res.redirect('/')
        }
    })
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

                res.render('inventory_menu', { data: data })
            } else {
                res.redirect('/')
            }
        } else {
            res.redirect('/')
        }
    } catch (error) {
        res.render('error', { error: 'Erro ao obter dados do perfil' })
    }
};

module.exports = { getMenuInventory, logout }