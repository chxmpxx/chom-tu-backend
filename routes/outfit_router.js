const outfitController = require('../controllers/outfit_controller')
const auth = require('../middleware/auth')

// router
const router = require('express').Router()

// use router
router.use(auth);

router.post('/all_outfit', outfitController.getAllOutfits)
router.post('/all_fav_outfit', outfitController.getAllFavOutfits)
router.post('/add_outfit', outfitController.addOutfit)
router.post('/fav_outfit/:id', outfitController.favOutfit)

router.get('/get_style', outfitController.getStyle)
router.get('/:id', outfitController.getOneOutfit)

router.put('/:id', outfitController.updateOutfit)
router.delete('/:id', outfitController.deleteOutfit)

module.exports = router