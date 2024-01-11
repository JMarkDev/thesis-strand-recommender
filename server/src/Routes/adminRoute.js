const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { passwordValidationRules, updateUsernameValidationRules, validateForm } = require("../middleware/formValidation")

router.get('/search/:name', adminController.searchAdmin);
router.get('/', adminController.getAllAdmin);
router.get('/:id', adminController.getAdminById);
router.put('/update/:id', passwordValidationRules(), validateForm, adminController.updateAdmin);
router.delete('/delete/:id', adminController.deleteAdmin);
router.post('/update-username/:id', updateUsernameValidationRules(), validateForm, adminController.updateUsername);
router.put('/update-username-verifyOTP/:id', updateUsernameValidationRules(), validateForm, adminController.VerifyOTP);

module.exports = router;   