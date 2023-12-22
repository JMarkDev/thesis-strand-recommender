const express = require("express");
const router = express.Router();
const otpController = require("../controllers/otpController")
const changePassController = require("../controllers/changePassController")
const { passwordValidationRules, validateForm } = require("../middleware/formValidation")

router.post('/', otpController.postOtp)
router.post('/verify', otpController.verifyOtp)
router.post('/resend', otpController.resendOTP)
// router.post('/email-verification', otpController.emailVerification)
router.post('/change-password', changePassController.changePasswordOTP)
router.post('/change-password-otp', changePassController.confirmOTP)
router.post('/confirm-change-password', passwordValidationRules(), validateForm, changePassController.confirmPassword)
// router.post('/verify-user', otpController.verifyUser)
// router.delete('/delete', otpController.deleteOTP)

module.exports = router;