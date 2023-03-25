const asyncHandler = require('express-async-handler');
const db = require('../models')
const { Op } = require('sequelize')
const sequelize = require('sequelize')
const firebaseApp = require("../config/firebase_config");
const { createPersistentDownloadUrl } = require('../key/firebase_storage');
const UUID = require("uuid-v4");

const Post = db.posts

const storage = firebaseApp.storage();
const bucket = storage.bucket();

// @desc    Create Post
// @route   POST /api/post/add_post
// @access  Private
const addPost = asyncHandler(async (req, res) => {
    if (req.files) {
        let uuid = UUID();
        let file = await req.files.file
        let fileName = file.name
        fileName = fileName.split('.').join('-' + Date.now() + '.');
        fileName = `post/${fileName}`

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
                user_id: req.user.id,
                post_img: createPersistentDownloadUrl(fileName, uuid),
                img_detail: req.body.img_detail,
                caption: req.body.caption,
            }
            const post = await Post.create(info)
            res.status(200).send(post)
        });
    
        blobStream.end(file.data);
    } else {
        res.status(400).send()
    }
})

// @desc    Get All Posts
// @route   POST /api/post/all_post
// @access  Private
const getAllPosts = asyncHandler(async (req, res) => {
    // todo: where follow
    let posts = await Post.findAll()
    res.status(200).send(posts)
})

// @desc    Get All This User Posts
// @route   GET /api/post/all_profile_post/:id
// @access  Private
const getAllProfilePosts = asyncHandler(async (req, res) => {
    let id = req.params.id
    let posts = await Post.findAll({ where: { user_id: id }})
    res.status(200).send(posts)
})

// @desc    Get All My Posts
// @route   GET /api/post/all_my_profile_post
// @access  Private
const getAllMyProfilePosts = asyncHandler(async (req, res) => {
    let posts = await Post.findAll({ where: { user_id: req.user.id }})
    res.status(200).send(posts)
})

// @desc    Get One Post
// @route   GET /api/post/:id
// @access  Private
const getOnePost = asyncHandler(async (req, res) => {
    let id = req.params.id
    let post = await Post.findOne({ where: { id: id }})
    res.status(200).send(post)
})

// @desc    Update Post
// @route   PUT /api/post/:id
// @access  Private
const updatePost = asyncHandler(async (req, res) => {
    let id = req.params.id
    const post = await Post.update(req.body, {where: { id: id }})
    res.status(200).send(post)
})

// @desc    Delete One Post
// @route   DELETE /api/post/:id
// @access  Private
const deletePost = asyncHandler(async (req, res) => {
    let id = req.params.id
    await Post.destroy({ where: { id: id } })
    res.status(200).send('Post is delete!')
})

module.exports = {
    addPost,
    
    getAllPosts,
    getAllProfilePosts,
    getAllMyProfilePosts,
    getOnePost,

    updatePost,
    deletePost
}