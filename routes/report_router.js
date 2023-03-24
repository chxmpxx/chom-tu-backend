const reportController = require('../controllers/report_controller')

// router
const router = require('express').Router()

// use router
router.post('/all_report', reportController.getAllReports)
router.post('/add_report', reportController.addReport)

router.get('/:id', reportController.getOneReport)

router.put('/:id', reportController.updateReport)
router.delete('/:id', reportController.deleteReport)

module.exports = router