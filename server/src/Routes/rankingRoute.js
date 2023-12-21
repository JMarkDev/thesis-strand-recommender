const express = require('express');
const router = express.Router();
const rankingController = require('../controllers/rankingController');

router.get('/', rankingController.getAllRanking);
router.get('/:id', rankingController.getRankingByStudentId);
router.post('/add', rankingController.addRanking);
router.put('/update/:id', rankingController.updateRanking);

module.exports = router;

