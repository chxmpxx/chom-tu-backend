const wardrobeController = require('../controllers/wardrobe_controller')
const detectController = require('../services/detect_service')

// router
const router = require('express').Router()

// use router

router.get('/all_wardrobe', wardrobeController.getAllWardrobes)
router.post('/add_wardrobe', wardrobeController.addWardrobe)

router.post('/detect', detectController.detect)

router.get('/:id', wardrobeController.getOneWardrobe)
router.put('/:id', wardrobeController.updateWardrobe)
router.delete('/:id', wardrobeController.deleteWardrobe)

module.exports = router