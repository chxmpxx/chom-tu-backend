const componentController = require('../controllers/component_controller')

// router
const router = require('express').Router()

// use router
router.post('/all_component', componentController.getAllComponents)
router.post('/add_component', componentController.addComponent)

router.delete('/:id', componentController.deleteComponent)

module.exports = router