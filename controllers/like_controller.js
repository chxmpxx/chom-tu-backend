const asyncHandler = require('express-async-handler');
const sequelize = require('sequelize')
const db = require('../models')

const Like = db.likes
const Post = db.posts

// @desc    Create Like For Like Post
// @route   POST /api/like/add_like
// @access  Private
const addLike = asyncHandler(async (req, res) => {
    const info = {
      user_id: req.user.id,
      post_id: req.body.post_id
    }
    await Like.create(info);

    await Post.update(
        { likes: sequelize.literal('likes + 1'), is_like: true },
        { where: { id: req.body.post_id } }
    )
    res.status(200).send('like')
})

// @desc    Get Likes
// @route   GET /api/like/get_likes/:id
// @access  Private
const getLikes = asyncHandler(async (req, res) => {
    let id = req.params.id

    let likes = await Like.findAll({
        where: { post_id: id },
        attributes: [[sequelize.fn('COUNT', sequelize.col('post_id')), 'post_id'],]
    })
    res.status(200).send(likes)
})

// @desc    Delete Like For Unlike Post
// @route   DELETE /api/like/:id
// @access  Private
const unlike = asyncHandler(async (req, res) => {
    let id = req.params.id
    await Like.destroy({ where: { post_id: id } })

    await Post.update(
        { likes: sequelize.literal('likes - 1'), is_like: false },
        { where: { id: id } }
    );

    res.status(200).send('unlike')
})

module.exports = {
    addLike,
    getLikes,
    unlike
}