const express = require('express');
const router = express.Router();
const gradesController = require('../controllers/gradesController');

router.get('/', gradesController.getAllGrades);
router.get('/:id', gradesController.getGradesById);
router.post('/add', gradesController.addGrades);
router.put('/update/:id', gradesController.updateGrades);

module.exports = router;