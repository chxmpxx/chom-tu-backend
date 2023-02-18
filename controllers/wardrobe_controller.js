const db = require('../models')
const { Op } = require('sequelize')
const admin = require("firebase-admin");
const serviceAccount = require("../key/firebase_key.json");
const { storageBucket, createPersistentDownloadUrl } = require('../key/firebase_storage');
const UUID = require("uuid-v4");

const Wardrobe = db.wardrobes

const firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: storageBucket
});
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
    let wardrobes;

    if(color[0] != 'None' && type[0] != 'None') {
        wardrobes = await Wardrobe.findAll({ 
            where: {
                category: category,
                color: { [Op.in]: color },
                type: { [Op.in]: type }
            }
        })
    } else if(color[0] == 'None' && type[0] != 'None') {
        wardrobes = await Wardrobe.findAll({
            where: {
                category: category,
                type: { [Op.in]:type }
            }
        })
    } else if(color[0] != 'None' && type[0] == 'None') {
        wardrobes = await Wardrobe.findAll({
            where: {
                category: category,
                color: { [Op.in]:color }
            }
        })
    } else if(color[0] == 'None' && type[0] == 'None') {
        wardrobes = await Wardrobe.findAll({ where: { category: category } })
    } else {
        res.status(400).send()
    }
    
    res.status(200).send(wardrobes)
}

// get all favorite wardrobes
const getAllFavWardrobes = async (req, res) => {
    let wardrobes = await Wardrobe.findAll({ where: { is_favorite: true } })
    res.status(200).send(wardrobes)
}

// get one wardrobe
const getOneWardrobe = async (req, res) => {
    let id = req.params.id
    let wardrobe = await Wardrobe.findOne({ where: { id: id }})
    res.status(200).send(wardrobe)
}

// ------------ UPDATE ------------

// update wardrobe
const updateWardrobe = async (req, res) => {
    let id = req.params.id
    const wardrobe = await Wardrobe.update(req.body, {where: { id: id }})
    res.status(200).send(wardrobe)
}

// ------------ DELETE ------------

// delete one wardrobe
const deleteWardrobe = async (req, res) => {
    let id = req.params.id
    await Wardrobe.destroy({ where: { id: id } })
    res.status(200).send('Wardrobe is delete!')
}

module.exports = {
    addWardrobe,

    getAllWardrobes,
    getOneWardrobe,
    getAllFavWardrobes,

    updateWardrobe,
    deleteWardrobe
}