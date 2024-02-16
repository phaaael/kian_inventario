const express = require('express')
const inventoryController = require('../controllers/inventoryController')

const router = express.Router()

router.get('/inventory/menu', inventoryController.getMenuInventory)

router.get('/inventory/logout', inventoryController.logout)

router.get('/inventory/management', inventoryController.inventoryManagement)

router.get('/inventory', inventoryController.inventory)

module.exports = router