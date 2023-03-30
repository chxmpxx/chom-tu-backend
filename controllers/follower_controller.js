const asyncHandler = require('express-async-handler');
const sequelize = require('sequelize')
const db = require('../models')

const Follower = db.followers
const User = db.users

// @desc    Create Follower For Follow Account
// @route   POST /api/follower/add_follow/:id
// @access  Private
const addFollow = asyncHandler(async (req, res) => {
    const info = {
      user_id: req.params.id,
      follower_id: req.user.id
    }
    await Follower.create(info);
    res.status(200).send('follow')
})

// @desc    Get Followers And Following
// @route   POST /api/follower/get_follow
// @access  Private
const getFollow = asyncHandler(async (req, res) => {
    let id = req.body.id
    let isCurrentUser = req.body.is_current_user
    let find = req.body.find

    if (isCurrentUser) {
        id = req.user.id
    }

    let userIdList = []

    if (find == 'Followers') {
        let followers = await Follower.findAll({ where: { user_id: id }, attributes: ['follower_id']})
        userIdList = followers.map(item => item.follower_id);
    } else {
        let following = await Follower.findAll({ where: { follower_id: id }, attributes: ['user_id'] })
        userIdList = following.map(item => item.user_id);
    }

    const userList = await User.findAll({ where: { id: userIdList }})
    res.status(200).send(userList)
})

// @desc    Delete Follower For Unfollower Post
// @route   DELETE /api/follower/:id
// @access  Private
const unfollow = asyncHandler(async (req, res) => {
    let id = req.params.id
    await Follower.destroy({ where: { user_id: id } })
    res.status(200).send('unfollow')
})

module.exports = {
    addFollow,
    getFollow,
    unfollow
}