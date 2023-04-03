const userController = require('../controllers/user_controller')
const auth = require('../middleware/auth')

// router
const router = require('express').Router()

// use router
router.post('/sign_up', userController.signUp)
router.post('/login', userController.login)

router.post('/change_password', auth, userController.changePassword)
router.post('/search_user', auth, userController.searchUser)
router.post('/all_user', auth, userController.getAllUser)

router.get('/current_user', auth, userController.getCurrentUser)
router.get('/get_user/:id', auth, userController.getUser)

router.put('/update_user', auth, userController.updateUser)
router.put('/update_status_user/:id', auth, userController.updateUserStatus)
router.put('/automatic_ban_user', auth, userController.automaticBanUser)

module.exports = router