const express = require('express')
const inventoryController = require('../controllers/inventoryController')

const router = express.Router()

router.get('/inventory/menu', inventoryController.getMenuInventory)

router.get('/inventory/logout', inventoryController.logout)

router.get('/inventory/registration', inventoryController.inventoryRegistration)

router.get('/inventory', inventoryController.inventory)

router.get('/inventory/request_loan', inventoryController.inventoryRequestLoan)

router.get('/inventory/all_requests', inventoryController.inventoryListAllRequests)

router.get ('/inventory/requests', inventoryController.inventoryRequests)

router.get('/inventory/export_spreadsheet', inventoryController.exportInventoryToExcel)

router.post('/inventory/registration/submit', inventoryController.inventoryRegisterItem)

router.post('/inventory/request_loan', inventoryController.inventoryRequestLoan)

router.post('/inventory/delivered/:id', inventoryController.inventoryItemDelivered)

router.post('/inventory/accept/:id', inventoryController.inventoryAcceptItem)

router.post('/inventory/refuse/:id', inventoryController.inventoryRefuseItem)

router.post('/inventory/change/:id', inventoryController.inventoryChangeItem)

router.post('/inventory/update_record', inventoryController.inventoryUpdateRecord)

module.exports = router