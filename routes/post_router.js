const postController = require('../controllers/post_controller')

// router
const router = require('express').Router()

// use router
router.post('/all_post', postController.getAllPosts)
router.post('/add_post', postController.addPost)

router.get('/all_profile_post/:id', postController.getAllProfilePosts)
router.get('/:id', postController.getOnePost)

router.put('/:id', postController.updatePost)
router.delete('/:id', postController.deletePost)

module.exports = router