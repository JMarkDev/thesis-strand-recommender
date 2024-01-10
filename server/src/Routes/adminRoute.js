const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { passwordValidationRules, validateForm } = require("../middleware/formValidation")

router.get('/search/:name', adminController.searchAdmin);
router.get('/', adminController.getAllAdmin);
router.get('/:id', adminController.getAdminById);
router.put('/update/:id', passwordValidationRules(), validateForm, adminController.updateAdmin);
router.delete('/delete/:id', adminController.deleteAdmin);

module.exports = router;   