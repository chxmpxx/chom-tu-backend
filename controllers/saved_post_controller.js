const asyncHandler = require('express-async-handler');
const db = require('../models')

const SavedPost = db.saved_posts
const Post = db.posts

// @desc    Create SavedPost For Saved Post
// @route   POST /api/saved_post/add_saved_post
// @access  Private
const addSavedPost = asyncHandler(async (req, res) => {
    const info = {
      user_id: req.body.user_id,
      post_id: req.body.post_id
    }
    await SavedPost.create(info);

    await Post.update(
        { is_saved: true },
        { where: { id: req.body.post_id } }
    )
    res.status(200).send('saved post')
})

// @desc    Get All Saved Posts
// @route   GET /api/saved_post/all_saved_posts/:id
// @access  Private
const getAllSavedPosts = asyncHandler(async (req, res) => {
    let id = req.params.id

    let postIdList = await SavedPost.findAll({
        where: { user_id: id },
        attributes: ['post_id']
    });
    postIdList = postIdList.map(item => item.post_id);

    let posts = await Post.findAll({ where: { id: postIdList } });
    res.status(200).send(posts)
})

// @desc    Delete SavedPost For Unsaved Post
// @route   DELETE /api/saved_post/:id
// @access  Private
const unsavedPost = asyncHandler(async (req, res) => {
    let id = req.params.id
    await SavedPost.destroy({ where: { post_id: id } })

    await Post.update(
        { is_saved: false },
        { where: { id: id } }
    );

    res.status(200).send('unsaved post')
})

module.exports = {
    addSavedPost,
    getAllSavedPosts,
    unsavedPost
}