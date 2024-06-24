const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')

router.get('/admin/user-management', adminController.userManagement)

router.get('/admin/create-user', adminController.getUserCreation)

router.get('/admin/supply-management', adminController.supplyManagement)

router.get('/admin/equipament-management', adminController.equipmentManagement)

router.get('/admin/request-management', adminController.requestManagement)

router.get('/admin/all-requests', adminController.allRequests)

router.post('/admin/create-user/submit', adminController.userCreation)

router.post('/admin/supply-entry/:id', adminController.supplyEntry)

router.post('/admin/supply-entry-request/:id', adminController.supplyEntryOfRequest)

router.post('/admin/supply-change/:id', adminController.changingCriticalQuantity)

module.exports = router