const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');
const { registerValidationRules, validateForm } = require('../middleware/formValidation');

router.post('/', registerValidationRules(), validateForm, registerController.handleRegister);

module.exports = router;
