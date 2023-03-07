const db = require('../models')
const { Op } = require('sequelize')
const sequelize = require('sequelize')
const firebaseApp = require("../config/firebase_config");
const { createPersistentDownloadUrl } = require('../key/firebase_storage');
const UUID = require("uuid-v4");

const Post = db.posts

const storage = firebaseApp.storage();
const bucket = storage.bucket();

// ------------ CREATE ------------

// create post
const addPost = async (req, res) => {
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
                user_id: req.body.user_id,
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
}

// ------------ READ ------------

// get all posts
const getAllPosts = async (req, res) => {
    let posts = await Post.findAll()
    res.status(200).send(posts)
}

// get all my posts
const getAllProfilePosts = async (req, res) => {
    let id = req.params.id
    let posts = await Post.findAll({ where: { user_id: id }})
    res.status(200).send(posts)
}

// get one post
const getOnePost = async (req, res) => {
    let id = req.params.id
    let post = await Post.findOne({ where: { id: id }})
    res.status(200).send(post)
}

// ------------ UPDATE ------------

// update post
const updatePost = async (req, res) => {
    let id = req.params.id
    const post = await Post.update(req.body, {where: { id: id }})
    res.status(200).send(post)
}

// ------------ DELETE ------------

// delete one post
const deletePost = async (req, res) => {
    let id = req.params.id
    await Post.destroy({ where: { id: id } })
    res.status(200).send('Post is delete!')
}

module.exports = {
    addPost,
    
    getAllPosts,
    getAllProfilePosts,
    getOnePost,

    updatePost,
    deletePost
}