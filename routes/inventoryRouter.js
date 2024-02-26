const express = require('express')
const inventoryController = require('../controllers/inventoryController')

const router = express.Router()

router.get('/inventory/menu', inventoryController.getMenuInventory)

router.get('/inventory/logout', inventoryController.logout)

router.get('/inventory/registration', inventoryController.inventoryRegistration)

router.get('/inventory', inventoryController.inventory)

router.get('/inventory/all_requests', inventoryController.inventoryListAllRequests)

router.post('/inventory/registration/submit', inventoryController.inventoryRegisterItem)

router.post('/inventory/delivered/:id', inventoryController.inventoryItemDelivered)

router.post('/inventory/change/:id', inventoryController.inventoryChangeItem)

module.exports = router