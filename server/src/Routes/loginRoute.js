const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const { loginValidationRules, validateForm } = require('../middleware/formValidation');

router.post('/', loginValidationRules(), validateForm, loginController.handleLogin);

module.exports = router;
