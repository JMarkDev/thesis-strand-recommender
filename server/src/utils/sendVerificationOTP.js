const otpModel = require('../models/otpModel')
const userModel = require('../models/userModel')
const { sendOTP } = require('./sendOTP')
// const { deleteOTP } = require('../controllers/otpController')
// const { verifyOtp } = require('../controllers/otpController')
const sendVerificationOTP = async (email) => {
    const checkExistingUser = await userModel.checkIfUsernameExists(email)
    try {
        if(!checkExistingUser) {
            throw Error("There's no account for the provided email.")
        }

        const otpDetails = {
            email,
            subject: "Registration Verification",
            message: "Verify your email with the code below.",
            duration: 5,
        }
        const createdOTP = await sendOTP(otpDetails);
        return res.status(200).json({ status: "success", message: "Verification OTP sent successfully." , createdOTP});
    } catch(error) {
        console.log(error)
        throw error
    }
}

module.exports = {
     sendVerificationOTP, 
    //  verifyUserEmail 
    };