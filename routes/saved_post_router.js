const savedPostController = require('../controllers/saved_post_controller')
const auth = require('../middleware/auth')

// router
const router = require('express').Router()

// use router
router.use(auth);

router.post('/add_saved_post', savedPostController.addSavedPost)
router.get('/all_saved_posts', savedPostController.getAllSavedPosts)

router.delete('/:id', savedPostController.unsavedPost)

module.exports = router