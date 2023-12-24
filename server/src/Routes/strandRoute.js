const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer({ dest: './uploads' });
const strandController = require('../controllers/strandController');

router
    .get('/total', strandController.strandRecommendedTotal)
    .get('/', strandController.getAllStrands)
    .get('/:id', strandController.getStrandById)
    .get('/monthly/:year', strandController.getStrandMonthlyData)

    .post('/add', upload.array('image', 5), strandController.addStrand)
    .put('/update/:id', upload.array("image", 5) ,strandController.updateStrand)
    .delete('/delete/:id', strandController.deleteStrand)

module.exports = router;
