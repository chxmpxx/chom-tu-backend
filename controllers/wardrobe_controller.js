const db = require('../models')
const { Op } = require('sequelize')

const Wardrobe = db.wardrobes

// ------------ CREATE ------------

// create wardrobe
const addWardrobe = async (req, res) => {
    if (req.files) {
        let file = await req.files.file
        let fileName = file.name
        fileName = fileName.split('.').join('-' + Date.now() + '.');
        file.mv(`./../chom-tu-frontend/assets/data/wardrobe/${fileName}`, async function (err) {
            if (err) {
                res.send(err)
            } else {
                let info = {
                    user_id: req.body.user_id,
                    category: req.body.category,
                    color: req.body.color,
                    type: req.body.type,
                    is_favorite: false,
                    wardrobe_img: `assets/data/wardrobe/${fileName}`
                }

                const wardrobe = await Wardrobe.create(info)
                res.status(200).send(wardrobe)
            }
        })
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