const express = require('express')
const router = express.Router()

const EmployeeController = require('../controller/EmployeeController')
const upload = require('../middleware/upload')
const authenticate = require('../middleware/authenticate')

router.get('/', authenticate, EmployeeController.index)
router.post('/show', authenticate, EmployeeController.show)
router.post('/add', authenticate, upload.single('avatar'), EmployeeController.store) //upload.array('avatar[]') for multiple files and change in postman from avatar to avatar[]
router.post('/update', authenticate, EmployeeController.update)
router.post('/delete', authenticate, EmployeeController.destroy)

module.exports = router