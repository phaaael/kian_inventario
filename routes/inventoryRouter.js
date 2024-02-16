const express = require('express')
const inventoryController = require('../controllers/inventoryController')

const router = express.Router()

router.get('/inventory', inventoryController.getMenuInventory)
router.get('/inventory/logout', inventoryController.logout)

module.exports = router