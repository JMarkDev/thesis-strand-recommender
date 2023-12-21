const express = require("express");
const router = express.Router();
const otpController = require("../controllers/otpController")
const changePassController = require("../controllers/changePassController")

router.post('/', otpController.postOtp)
router.post('/verify', otpController.verifyOtp)
router.post('/resend', otpController.resendOTP)
// router.post('/email-verification', otpController.emailVerification)
router.post('/change-password', changePassController.handleChangePassword)
router.post('/change-password/verify', changePassController.verifyOTP)
// router.post('/verify-user', otpController.verifyUser)
// router.delete('/delete', otpController.deleteOTP)

module.exports = router;