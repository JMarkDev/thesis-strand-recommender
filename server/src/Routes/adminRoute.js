const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/', adminController.getAllAdmin);
router.get('/:id', adminController.getAdminById);
router.put('/update/:id', adminController.updateAdmin);
router.delete('/delete/:id', adminController.deleteAdmin);
router.get('/search/:name', adminController.searchAdmin);

module.exports = router;   