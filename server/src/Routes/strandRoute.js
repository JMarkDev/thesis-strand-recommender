const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer({ dest: './uploads' });
const strandController = require('../controllers/strandController');

router.get('/total', strandController.strandRecommendedTotal)
router.get('/monthly/:year', strandController.getStrandMonthlyData)
router.get('/id/:id', strandController.getStrandById)
router.get('/name/:name', strandController.getStrandByName)
router.get('/all', strandController.getAllStrands)

router.post('/add', upload.array('image', 5), strandController.addStrand)
router.put('/update/:id', upload.array("image", 5) ,strandController.updateStrand)
router.delete('/delete/:id', strandController.deleteStrand)

module.exports = router;
