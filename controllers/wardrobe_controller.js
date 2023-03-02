const db = require('../models')
const { Op } = require('sequelize')
const firebaseApp = require("../config/firebase_config");
const { createPersistentDownloadUrl } = require('../key/firebase_storage');
const UUID = require("uuid-v4");
const { detectTypeAndCategory } = require("../services/detect_category_service");
const { detectColor } = require("../services/detect_color_service");

const Wardrobe = db.wardrobes
const Component = db.components

const storage = firebaseApp.storage();
const bucket = storage.bucket();

// ------------ CREATE ------------

// create wardrobe
const addWardrobe = async (req, res) => {
    if (req.files) {
        let uuid = UUID();
        let file = await req.files.file
        let fileName = file.name
        fileName = fileName.split('.').join('-' + Date.now() + '.');
        fileName = `wardrobe/${fileName}`

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
                category: req.body.category,
                sub_category: req.body.sub_category,
                color: req.body.color,
                type: req.body.type,
                is_favorite: false,
                wardrobe_img: createPersistentDownloadUrl(fileName, uuid)
            }
            const wardrobe = await Wardrobe.create(info)
            res.status(200).send(wardrobe)
        });
    
        blobStream.end(file.data);
    } else {
        res.status(400).send()
    }
}

// ------------ READ ------------

// get all wardrobes
const getAllWardrobes = async (req, res) => {
    let category = req.body.category
    let color = req.body.color
    let type = req.body.type
    let order = req.body.order
    let isOutfit = req.body.isOutfit
    let wardrobeIdList = req.body.wardrobeIdList
    let bottom = req.body.bottom

    let wardrobes = [];
    let where = {category: category}
        
    if (color.length != 0) {
        where.color =  { [Op.in]: color }
    }

    if (isOutfit && wardrobeIdList.length != 0) {
        where.id = { [Op.notIn]: wardrobeIdList }
    }

    if (category == 'Bottom') {
        let skirts = []
        let shorts = []
        let trousers = []

        if (type.skirts.length != 0) {
            where.sub_category = 'Skirts'
            where.type =  { [Op.in]: type.skirts }

            skirts = await Wardrobe.findAll({ where: where, order: order })
        }

        if (type.shorts.length != 0) {
            where.sub_category = 'Shorts'
            where.type =  { [Op.in]: type.shorts }

            shorts = await Wardrobe.findAll({ where: where, order: order })
        }

        if (type.trousers.length != 0) {
            where.sub_category = 'Trousers'
            where.type =  { [Op.in]: type.trousers }

            trousers = await Wardrobe.findAll({ where: where, order: order })
        }

        if (type.skirts.length == 0 && type.shorts.length == 0 && type.trousers.length == 0) {
            if (isOutfit) {
                where.sub_category = bottom
            }
            wardrobes = await Wardrobe.findAll({ where: where, order: order })
        }

        wardrobes = wardrobes.concat(skirts);
        wardrobes = wardrobes.concat(shorts);
        wardrobes = wardrobes.concat(trousers);
    } else {
        if (type.length != 0) {
            where.type =  { [Op.in]: type }
        }
      
        wardrobes = await Wardrobe.findAll({ where: where, order: order })
    }
    
    res.status(200).send(wardrobes)
}

// get all favorite wardrobes
const getAllFavWardrobes = async (req, res) => {
    let order = req.body.order
    let color = req.body.color
    let where = { is_favorite: true }
        
    if (color.length != 0) {
        where.color =  { [Op.in]: color }
    }

    let wardrobes = await Wardrobe.findAll({ where: where, order: order })
    res.status(200).send(wardrobes)
}

// get one wardrobe
const getOneWardrobe = async (req, res) => {
    let id = req.params.id
    let wardrobe = await Wardrobe.findOne({ where: { id: id }})
    res.status(200).send(wardrobe)
}

// get list of outfit id that contain this wardrobe
const getOutfitIdFromWardrobe = async (req, res) => {
    let id = req.params.id
    let outfitId = await Component.findAll({
        where: { wardrobe_id: id },
        attributes: ['outfit_id']
    })
    console.log(outfitId);
    const outfitIdList = outfitId.map(item => item.outfit_id);
    res.status(200).send(outfitIdList)
}

// ------------ UPDATE ------------

// update wardrobe
const updateWardrobe = async (req, res) => {
    let id = req.params.id
    if(req.files) {
        // todo: update firebase image
        const wardrobe = await Wardrobe.update(req.body, {where: { id: id }})
        res.status(200).send(wardrobe)
    } else {
        const wardrobe = await Wardrobe.update(req.body, {where: { id: id }})
        res.status(200).send(wardrobe)
    }
}

const favWardrobe = async (req, res) => {
    let id = req.params.id
    await Wardrobe.update(req.body, {where: { id: id }})
    res.status(200).send('success')
}

// ------------ DELETE ------------

// delete one wardrobe
const deleteWardrobe = async (req, res) => {
    let id = req.params.id
    await Wardrobe.destroy({ where: { id: id } })
    res.status(200).send('Wardrobe is delete!')
}

// ------------ SERVICE ------------

// wardrobe detection
const wardrobeDetection = async (req, res) => {
    if (req.files) {
        let file = await req.files.file
        // let result = await detectTypeAndCategory(file.data)
        // result.color = await detectColor(file.data)

        let result = { category: 'Top', subCategory: 'None', color: 'Pink', type: 'Vest'}
        res.status(200).send(result)
    }
    res.status(400).send()
}

module.exports = {
    addWardrobe,

    getAllWardrobes,
    getOneWardrobe,
    getAllFavWardrobes,
    wardrobeDetection,
    getOutfitIdFromWardrobe,

    updateWardrobe,
    favWardrobe,

    deleteWardrobe
}