const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentsController');
const { registerValidationRules, validateForm } = require('../middleware/formValidation');

router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudentbyId)
router.put('/update/:id', registerValidationRules(), validateForm, studentController.updateStudent)
router.delete('/delete/:id', studentController.deleteStudent);
router.get('/search/:name', studentController.searchStudent);
router.put('/update-recommended/:id', studentController.updateRecommended);
router.get('/all/recommended', studentController.getAllRecommendedStrand);
router.get('/filter-recommended/:recommended', studentController.filterRecommended);

module.exports = router;
