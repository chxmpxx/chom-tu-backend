const savedPostController = require('../controllers/saved_post_controller')

// router
const router = require('express').Router()

// use router
router.post('/add_saved_post', savedPostController.addSavedPost)
router.get('/all_saved_posts/:id', savedPostController.getAllSavedPosts)

router.delete('/:id', savedPostController.unsavedPost)

module.exports = router