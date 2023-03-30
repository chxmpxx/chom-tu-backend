const followerController = require('../controllers/follower_controller')
const auth = require('../middleware/auth')

// router
const router = require('express').Router()

// use router
router.use(auth);

router.post('/add_follow/:id', followerController.addFollow)
router.post('/get_follow', followerController.getFollow)
router.delete('/:id', followerController.unfollow)

module.exports = router