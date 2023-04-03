const asyncHandler = require('express-async-handler');
const db = require('../models')
const { Op } = require('sequelize')
const sequelize = require('sequelize')
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const firebaseApp = require("../config/firebase_config");
const { createPersistentDownloadUrl } = require('../key/firebase_storage');
const UUID = require("uuid-v4");
const { log } = require('firebase-functions/logger');

const User = db.users
const Post = db.posts
const Like = db.likes
const SavedPost = db.saved_posts

const storage = firebaseApp.storage();
const bucket = storage.bucket();

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

    res.status(200).json({ message: 'Sign Up Successful' });
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
                password: user.password,
                email: user.email,
                username: user.username,
                bio: user.bio,
                user_img: user.user_img,
                }
        },
        process.env.ACCESS_TOKEN_SECRET,
    );

    res.status(200).json({ accessToken: accessToken, message: 'Login Successful', role: user.role });
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

// @desc    Get Current User
// @route   GET /api/user/current_user
// @access  Private
const getCurrentUser = asyncHandler(async (req, res) => {
    let id = req.user.id
    let user = await User.findOne({ where: { id: id }})
    res.status(200).send(user)
})

// @desc    Get All User
// @route   POST /api/user/all_user
// @access  Private
const getAllUser = asyncHandler(async (req, res) => {
    let order = req.body.order
    let isBan = req.body.is_ban
    let where = { role: { [Op.not]: 'Admin' } }

    if (isBan != -1) {
        where = { is_ban: isBan }
    }
  
    let users = await User.findAll({ where: where, order: order })
    res.status(200).send(users)
})

// @desc    Get User
// @route   GET /api/user/get_user/:id
// @access  Private
const getUser = asyncHandler(async (req, res) => {
    let id = req.params.id
    let user = await User.findOne({ where: { id: id }})
    res.status(200).send(user)
})

// @desc    Update Status User
// @route   PUT /api/user/update_status_user/:id
// @access  Private
const updateUserStatus = asyncHandler(async (req, res) => {
    let id = req.params.id

    await User.update(req.body, {where: { id: id }})
    res.status(200).json({ message: 'Update User Status Successful' });
})

// @desc    Update User
// @route   PUT /api/user/update_user
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
    let name = req.body.name
    let username = req.body.username

    let validate = { "username": "" }
    let existingUsername = await User.findOne({
        where: {
            username: username,
            id: { [Op.not]: req.user.id }
        }
    });
    if (existingUsername) validate.username = 'existingUsername'
    if (existingUsername != null || username.length == 0 || name.length == 0) return res.status(400).json(validate)

    if (req.files) {
        let uuid = UUID();
        let file = await req.files.file
        let fileName = file.name
        fileName = fileName.split('.').join('-' + Date.now() + '.');
        fileName = `user/${fileName}`

        const fileUpload = bucket.file(fileName);
        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype,
                firebaseStorageDownloadTokens: uuid
            }
        });

        blobStream.on("error", (err) => {
            res.status(405).json(err);
        });
        blobStream.on("finish", async () => {
            let info = {
                name: name,
                username: username,
                user_img: createPersistentDownloadUrl(fileName, uuid)
            }
            await User.update(info, {where: { id: req.user.id }})
            res.status(200).json({ message: 'Update User Successful' });
        });
        blobStream.end(file.data);

    } else {
        let info = {
            name: name,
            username: username
        }
        await User.update(info, {where: { id: req.user.id }})
        res.status(200).json({ message: 'Update User Successful' });
    }
})

// @desc    Update Users Password
// @route   POST /api/user/change_password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
    let currentPassword = req.body.current_password
    let newPassword = req.body.new_password
    let confirmNewPassword = req.body.confirm_new_password

    // validate
    let validate = {"password": "", "new_password": ""}
    if (currentPassword.length == 0) {
        return res.status(400).json(validate)
    } 
    const user = await User.findOne({ where: { id: req.user.id }})
    if (!await bcrypt.compare(currentPassword, user.password)) {
        validate.password = 'passwordIncorrect'
        return res.status(400).json(validate)
    }
    if (newPassword.length == 0 || confirmNewPassword.length == 0 || newPassword !== confirmNewPassword) {
        if (newPassword !== confirmNewPassword) {
            validate.new_password = 'passwordNotMatch'
        }
        return res.status(400).json(validate)
    }

    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(newPassword, salt)
    let info = { password: passwordHash }
    await User.update(info, { where: { id: req.user.id }})
    res.status(200).json({ message: 'Change Password Successful' });
})

// @desc    Automatic Ban User
// @route   PUT /api/user/automatic_ban_user
// @access  Private
const automaticBanUser = asyncHandler(async (req, res) => {
    let charges = req.body.charges
    let info = { is_ban: 1 }

    let users = await User.findAll({})
    for (let user of users) {
        if (user.total_charges >= charges) {
            if (user.isBan != 1) {
                await User.update(info, { where: { id: user.id } })
            }
        }
    }

    res.status(200).json({ message: 'Automatic Ban User Successful' });
})

module.exports = {
    signUp,
    login,
    searchUser,

    getCurrentUser,
    getUser,
    getAllUser,

    updateUserStatus,
    updateUser,
    changePassword,
    automaticBanUser
}