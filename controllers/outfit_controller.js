const asyncHandler = require('express-async-handler');
const db = require('../models')
const { Op } = require('sequelize')
const sequelize = require('sequelize')
const firebaseApp = require("../config/firebase_config");
const { createPersistentDownloadUrl } = require('../key/firebase_storage');
const UUID = require("uuid-v4");

const Outfit = db.outfits

const storage = firebaseApp.storage();
const bucket = storage.bucket();

// @desc    Create Outfit
// @route   POST /api/outfit/add_outfit
// @access  Private
const addOutfit = asyncHandler(async (req, res) => {
    if (req.files) {
        let uuid = UUID();
        let file = await req.files.file
        let fileName = file.name
        fileName = fileName.split('.').join('-' + Date.now() + '.');
        fileName = `outfit/${fileName}`

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
                style: req.body.style,
                detail: req.body.detail,
                is_favorite: false,
                bg_color: req.body.bg_color,
                outfit_img: createPersistentDownloadUrl(fileName, uuid)
            }
            const outfit = await Outfit.create(info)
            res.status(200).send(`${outfit.dataValues.id}`)
        });
    
        blobStream.end(file.data);
    } else {
        res.status(400).send()
    }
})

// @desc    Get All Outfits
// @route   POST /api/outfit/all_outfit
// @access  Private
const getAllOutfits = asyncHandler(async (req, res) => {
    let order = req.body.order
    let style = req.body.style
    let where = {}

    if (style.length != 0) {
        where.style =  { [Op.in]: style }
    }
  
    let outfits = await Outfit.findAll({ where: where, order: order })
    res.status(200).send(outfits)
})

// @desc    Get All Favorite Outfits
// @route   POST /api/outfit/all_fav_outfit
// @access  Private
const getAllFavOutfits = asyncHandler(async (req, res) => {
    let order = req.body.order
    let style = req.body.style
    let where = { is_favorite: true }
        
    if (style.length != 0) {
        where.style =  { [Op.in]: style }
    }

    let outfits = await Outfit.findAll({ where: where, order: order })
    res.status(200).send(outfits)
})

// @desc    Get One Outfit
// @route   GET /api/outfit/:id
// @access  Private
const getOneOutfit = asyncHandler(async (req, res) => {
    let id = req.params.id
    let outfit = await Outfit.findOne({ where: { id: id }})
    res.status(200).send(outfit)
})

// @desc    Get Outfit Style
// @route   GET /api/outfit/get_style/:id
// @access  Private
const getStyle = asyncHandler(async (req, res) => {
    let id = req.params.id
    let outfit = await Outfit.findAll({
        where: { user_id: id },
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('style')) ,'style']]
    })
    const styleList = outfit.map(item => item.style);
    res.status(200).send(styleList)
})

// @desc    Update Outfit
// @route   PUT /api/outfit/:id
// @access  Private
const updateOutfit = asyncHandler(async (req, res) => {
    let id = req.params.id
    if(req.files) {
        // todo: update firebase image
        const outfit = await Outfit.update(req.body, {where: { id: id }})
        res.status(200).send(outfit)
    } else {
        const outfit = await Outfit.update(req.body, {where: { id: id }})
        res.status(200).send(outfit)
    }
})

// @desc    Update Outfit Favorite
// @route   POST /api/outfit/fav_outfit/:id
// @access  Private
const favOutfit = asyncHandler(async (req, res) => {
    let id = req.params.id
    await Outfit.update(req.body, {where: { id: id }})
    res.status(200).send('success')
})

// @desc    Delete One Outfit
// @route   DELETE /api/outfit/:id
// @access  Private
const deleteOutfit = asyncHandler(async (req, res) => {
    let id = req.params.id
    await Outfit.destroy({ where: { id: id } })
    res.status(200).send('Outfit is delete!')
})

module.exports = {
    addOutfit,

    getAllOutfits,
    getAllFavOutfits,
    getOneOutfit,
    getStyle,

    updateOutfit,
    favOutfit,

    deleteOutfit
}