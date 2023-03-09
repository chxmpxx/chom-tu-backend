const likeController = require('../controllers/like_controller')

// router
const router = require('express').Router()

// use router
router.post('/add_like', likeController.addLike)
router.get('/get_likes/:id', likeController.getLikes)

router.delete('/:id', likeController.unlike)

module.exports = router