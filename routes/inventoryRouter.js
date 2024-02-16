const express = require('express')
const inventoryController = require('../controllers/inventoryController')

const router = express.Router()

router.get('/inventory/menu', inventoryController.getMenuInventory)

router.get('/inventory/logout', inventoryController.logout)

router.get('/inventory/registration', inventoryController.inventoryRegistration)

router.get('/inventory', inventoryController.inventory)

router.post('/inventory/registration/submit', inventoryController.inventoryRegisterItem)

module.exports = router