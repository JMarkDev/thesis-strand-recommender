const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer({ dest: './uploads' });
const strandController = require('../controllers/strandController');

router.get('/', strandController.getAllStrands);
router.get('/:id', strandController.getStrandById);
router.post('/add', upload.array('image', 5), strandController.addStrand);
router.put('/update/:id', upload.array("image", 5) ,strandController.updateStrand);
router.delete('/delete/:id', strandController.deleteStrand);

module.exports = router;
