const express = require('express');
const router = express.Router();
const recommendedController = require('../controllers/recommendedController');

router.get('/strandConditions', recommendedController.getStrandConditions)
router.post('/recommendStrand', recommendedController.recommendStrand)

module.exports = router;