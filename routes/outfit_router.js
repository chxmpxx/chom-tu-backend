const outfitController = require('../controllers/outfit_controller')

// router
const router = require('express').Router()

// use router
router.post('/all_outfit', outfitController.getAllOutfits)
router.post('/all_fav_outfit', outfitController.getAllFavOutfits)
router.post('/add_outfit', outfitController.addOutfit)
router.post('/fav_outfit/:id', outfitController.favOutfit)

router.get('/get_style/:id', outfitController.getStyle)
router.get('/:id', outfitController.getOneOutfit)

router.put('/:id', outfitController.updateOutfit)
router.delete('/:id', outfitController.deleteOutfit)

module.exports = router