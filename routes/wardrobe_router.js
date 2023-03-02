const wardrobeController = require('../controllers/wardrobe_controller')

// router
const router = require('express').Router()

// use router
router.post('/all_wardrobe', wardrobeController.getAllWardrobes)
router.post('/all_fav_wardrobe', wardrobeController.getAllFavWardrobes)
router.post('/add_wardrobe', wardrobeController.addWardrobe)
router.post('/detect_wardrobe', wardrobeController.wardrobeDetection)
router.post('/fav_wardrobe/:id', wardrobeController.favWardrobe)

router.get('/outfit_id_from_wardrobe/:id', wardrobeController.getOutfitIdFromWardrobe)
router.get('/:id', wardrobeController.getOneWardrobe)
router.put('/:id', wardrobeController.updateWardrobe)
router.delete('/:id', wardrobeController.deleteWardrobe)

module.exports = router