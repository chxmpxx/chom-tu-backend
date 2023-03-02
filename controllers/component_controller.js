const db = require('../models')

const Component = db.components

// ------------ CREATE ------------

// create component
const addComponent = async (req, res) => {
    let info = {
        wardrobe_id: req.body.wardrobe_id,
        outfit_id: req.body.outfit_id,
        position: req.body.position,
    }
    const component = await Component.create(info)
    res.status(200).send(component)
}

// ------------ READ ------------

// get all components
const getAllComponents = async (req, res) => {
    let wardrobe_id = req.body.wardrobe_id

    let components = await Component.findAll({ where: { wardrobe_id: wardrobe_id }})
    res.status(200).send(components)
}

// ------------ UPDATE ------------
// ...

// ------------ DELETE ------------

// delete one component
const deleteComponent = async (req, res) => {
    let id = req.params.id
    await Component.destroy({ where: { outfit_id: id } })
    res.status(200).send('Component is delete!')
}

module.exports = {
    addComponent,
    getAllComponents,
    deleteComponent
}