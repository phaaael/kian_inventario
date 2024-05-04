const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')

router.get('/admin/user-management', adminController.userManagement)

router.get('/admin/create-user', adminController.getUserCreation)

router.post('/admin/create-user/submit', adminController.userCreation)

module.exports = router