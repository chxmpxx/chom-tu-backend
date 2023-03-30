const asyncHandler = require('express-async-handler');
const db = require('../models')
const { Op } = require('sequelize')
const sequelize = require('sequelize')
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const User = db.users
const Post = db.posts
const Like = db.likes
const SavedPost = db.saved_posts

// @desc    Sign Up
// @route   POST /api/user/sign_up
// @access  Public
const signUp = asyncHandler(async (req, res) => {
    let name = req.body.name
    let email = req.body.email
    let username = req.body.username
    let password = req.body.password
    let confirmPassword = req.body.confirm_password

    // validate
    const existingEmail = await User.findOne({ where: { email }})
    const existingUsername = await User.findOne({ where: { username }})
    const validate = ( existingEmail || existingUsername ||
        password !== confirmPassword )
        && { email: existingEmail ? 'existingEmail' : '',
        username: existingUsername ? 'existingUsername' : '',
        password: password !== confirmPassword ? 'passwordNotMatch' : '' }
    if (validate) {
        return res.status(400).json(validate)
    } 

    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(password, salt)

    let info = {
        name,
        email,
        username,
        password: passwordHash
    }

    await User.create(info)

    res.status(200).json({ message: 'Sign Up Success' });
})

// @desc    Login
// @route   POST /api/user/login
// @access  Public
const login = asyncHandler(async (req, res) => {
    let username = req.body.username
    let password = req.body.password

    const user = await User.findOne({ where: { username: username }})

    // validate
    let validate = {"account": "", "password": "", "ban": ""}

    if (username.length == 0) {
        return res.status(400).json(validate)
    } 
    if (!user) {
        validate.account = 'noAccount'
        return res.status(400).json(validate)
    }
    if (password.length == 0) {
        return res.status(400).json(validate)
    } 
    if (!await bcrypt.compare(password, user.password)) {
        validate.password = 'passwordIncorrect'
        return res.status(400).json(validate)
    }
    if (user.is_ban) {
        validate.ban = 'banned'
        return res.status(400).json(validate)
    }

    // Setup Post
    Post.update({ is_like: false, is_saved: false }, { where: {} })

    // Setup is_like
    let likePostIdList = await Like.findAll({
        where: { user_id: user.id },
        attributes: ['post_id']
    });
    likePostIdList = likePostIdList.map(item => item.post_id);
    Post.update({ is_like: true }, { where: { id: likePostIdList } });

    // Setup is_saved
    let savedPostIdList = await SavedPost.findAll({
        where: { user_id: user.id },
        attributes: ['post_id']
    });
    savedPostIdList = savedPostIdList.map(item => item.post_id);
    Post.update({ is_saved: true }, { where: { id: savedPostIdList } });
    
    const accessToken = jwt.sign(
        {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                username: user.username,
                bio: user.bio,
                user_img: user.user_img
                }
        },
        process.env.ACCESS_TOKEN_SECRET,
    );

    res.status(200).json({ accessToken: accessToken, message: 'Login Success' });
})

// @desc    Search User
// @route   POST /api/user/search_user
// @access  Private
const searchUser = asyncHandler(async (req, res) => {
    let username = req.body.username

    let users = await User.findAll({
        where: {
            username: { [Op.startsWith]: username },
            id: { [Op.ne]: req.user.id }
        }
    })

    res.status(200).send(users)
})

// @desc    Get One User
// @route   GET /api/user/:id
// @access  Private
const getOneUser = asyncHandler(async (req, res) => {
    let id = req.params.id
    let user = await User.findOne({ where: { id: id }})
    res.status(200).send(user)
})

module.exports = {
    signUp,
    login,
    searchUser,
    getOneUser
}