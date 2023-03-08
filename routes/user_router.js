const userController = require('../controllers/user_controller')
const auth = require('../middleware/auth')

// router
const router = require('express').Router()

// use router
router.post('/sign_up', userController.signUp)
router.post('/login', userController.login)
// router.post('/login', auth, userController.login)

module.exports = router