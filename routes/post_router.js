const postController = require('../controllers/post_controller')
const auth = require('../middleware/auth')

// router
const router = require('express').Router()

// use router
router.use(auth);

router.post('/all_post', postController.getAllPosts)
router.post('/add_post', postController.addPost)

router.get('/all_profile_post/:id/:is_current_user', postController.getAllProfilePosts)
router.get('/:id', postController.getOnePost)

router.put('/:id', postController.updatePost)
router.delete('/:id', postController.deletePost)

module.exports = router