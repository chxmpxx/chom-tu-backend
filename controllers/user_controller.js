const asyncHandler = require('express-async-handler');
const db = require('../models')
const { Op } = require('sequelize')
const sequelize = require('sequelize')
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const User = db.users

// @desc    Sign Up
// @route   POST /api/user/sign_up
// @access  Public
const signUp = asyncHandler(async (req, res) => {
    try {
        let name = req.body.name
        let email = req.body.email
        let username = req.body.username
        let password = req.body.password
        let confirmPassword = req.body.confirm_password

        let validate = {"email": "", "username": "", "password": ""}

        let existingEmail = await User.findOne({ where: { email: email }})
        if (existingEmail) {
            validate.email = 'existingEmail'
        }

        let existingUsername = await User.findOne({ where: { username: username }})
        if (existingUsername) {
            validate.username = 'existingUsername'
        }

        if (password != confirmPassword) {
            validate.password = 'passwordNotMatch'
        }

        if (existingEmail != null || existingUsername != null || password != confirmPassword || name.length == 0 || email.length == 0 || username.length == 0 || password.length == 0 || confirmPassword.length == 0) {
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
        const user = await User.create(info)
        return res.status(200).send(user)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

// @desc    Login
// @route   POST /api/user/login
// @access  Public
const login = asyncHandler(async (req, res) => {
    try {
        let username = req.body.username
        let password = req.body.password

        let validate = {"account": "", "password": "", "ban": ""}

        const user = await User.findOne({ where: { username: username }})
        if (username.length == 0) {
            return res.status(400).json(validate)
        } else if (!user) {
            validate.account = 'noAccount'
            return res.status(400).json(validate)
        } else {
            if (password.length == 0) {
                return res.status(400).json(validate)
            } else {
                const isMatch = await bcrypt.compare(password, user.password)
                if (!isMatch) {
                    validate.password = 'passwordIncorrect'
                    return res.status(400).json(validate)
                } else {
                    if (user.is_ban) {
                        validate.ban = 'banned'
                        return res.status(400).json(validate)
                    }
                }
            }
        }
        
        res.status(200).json(
            {
                id: user.id,
                name: user.name,
                email: user.email,
                username: user.username,
                bio: user.bio,
                user_img: user.user_img
            }
        )

        // const accessToken = jwt.sign(
        //     {
        //         id: user.id,
        //         name: user.name,
        //         email: user.email,
        //         username: user.username,
        //         bio: user.bio,
        //         user_img: user.user_img
        //     },
        //     process.env.ACCESS_TOKEN_SECRET,
        // );
        // res.status(200).json({accessToken: accessToken, message: 'Login Success'});
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = {
    signUp,
    login
}