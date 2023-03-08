const asyncHandler = require('express-async-handler');
const db = require('../models')

const Component = db.components

// @desc    Create Component
// @route   POST /api/component/add_component
// @access  Private
const addComponent = asyncHandler(async (req, res) => {
    let info = {
        wardrobe_id: req.body.wardrobe_id,
        outfit_id: req.body.outfit_id,
        position: req.body.position,
    }
    const component = await Component.create(info)
    res.status(200).send(component)
})

// @desc    Get All Components
// @route   POST /api/component/all_component
// @access  Private
const getAllComponents = asyncHandler(async (req, res) => {
    let wardrobe_id = req.body.wardrobe_id

    let components = await Component.findAll({ where: { wardrobe_id: wardrobe_id }})
    res.status(200).send(components)
})

// @desc    Delete One Component
// @route   DELETE /api/component/:id
// @access  Private
const deleteComponent = asyncHandler(async (req, res) => {
    let id = req.params.id
    await Component.destroy({ where: { outfit_id: id } })
    res.status(200).send('Component is delete!')
})

module.exports = {
    addComponent,
    getAllComponents,
    deleteComponent
}