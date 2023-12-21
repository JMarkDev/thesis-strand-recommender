const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: './uploads' });
const courseController = require('../controllers/courseController');

router.get('/', courseController.getAllCourse);
router.get('/:id', courseController.getCourseById);
router.post('/add', upload.single('image'), courseController.addCourse);
router.put('/edit/:id', upload.single('image'), courseController.updateCourse);
router.delete('/delete/:id', courseController.deleteCourse);
router.get('/fetch/:strand', courseController.getCourseByStrand);

module.exports = router;