const express = require('express')
const registerController = require('./../controllers/registerController')

const router = express.Router()

router.get('/register', registerController.getRegister)

router.post('/register/submit', registerController.register)

module.exports = router