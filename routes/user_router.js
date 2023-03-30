const userController = require('../controllers/user_controller')
const auth = require('../middleware/auth')

// router
const router = require('express').Router()

// use router
router.post('/sign_up', userController.signUp)
router.post('/login', userController.login)

router.post('/search_user', auth, userController.searchUser)
router.get('/:id', auth, userController.getOneUser)

module.exports = router