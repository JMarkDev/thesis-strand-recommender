const bcrypt = require("bcryptjs");
const date = require('date-and-time');
const userModel = require("../models/userModel");
const saltRounds = 10;
const { sendOTP } = require('../utils/sendOTP')
const otpModel = require('../models/otpModel');
const { successRegistrationEmail } = require('../utils/successRegistrationEmail')

const changePasswordOTP = async (req, res) => {
    const { username} = req.body;

    if(!username) {
        return res.status(400).json({
            status: "error",
            message: "Username is required"
        })
    }

    try {
        const usernameExists = await userModel.checkIfUsernameExists(username);
        const isUserVerified = await userModel.checkVerifiedUserEmail(username);
        if (usernameExists && isUserVerified) {
            await sendOTPVerification(username);
            return res.status(200).json({
                status: "success",
                message: `Verification OTP sent to ${username}.`,
            });
        } else {
            return res.status(400).json({
                status: "error",
                message: "Username does not exist. Please enter a valid username."
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ Error: "Change password error in server" });
    }
}

// send message to email
const sendOTPVerification = async (username) => {
    try{
        const createdOTP = await sendOTP({
            email: username,
            subject: "Reset Strand Recommender password",
            message: "To reset your password, please verify your email with the code below:",
            duration: 5,
        });
        return createdOTP;
    } catch (error) {
        console.log(error)
        throw new Error("Error sending OTP")
    }
}

const confirmOTP = async (req, res) => {
    try {
    const { username, otp } = req.body;

    if(!otp) {
        return res.status(400).json({
            status: "error",
            message: "OTP is required"
        })
    }
    // find otp in database
    const matchedOTPRecord = await otpModel.otpFindOne(username);
    
    const { result } = matchedOTPRecord;
    const { expiresAt } = result[0];  // Assuming result is an array 

    // Check if OTP is expired
    if (expiresAt < Date.now()) {
        return res.status(400).json({
            status: "error", 
            message: 'Code has expired. Request for a new one' 
        });
    }

    // check if OTP is correct
    const verifyOtpResult = await otpModel.verifyOtp(username);
    if(verifyOtpResult) {
        const matchOtp = await bcrypt.compare(otp, verifyOtpResult[0].otp);

        if(matchOtp) {
            return res.status(200).json({
                status: "success",
                message: "OTP verified successfully.",
            });
        } else {
            return res.status(400).json({
                status: "error",
                message: "Invalid OTP. Please try again."
            });
        }
    }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ Error: "Confirm OTP error in server" });
    }
}

const confirmPassword = async (req, res) => {
    try {
        const { username, password, confirmPassword, otp } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const createdAt = new Date();
        const formattedDate = date.format(createdAt, 'YY/MM/DD HH:mm:ss');
        
        // Ensure OTP record exists
        const matchedOTPRecord = await otpModel.otpFindOne(username);

        if (!matchedOTPRecord) {
            return res.status(400).json({ message: 'OTP record not found' });
        }

        // Check if OTP is correct
        if (otp.length === 0) {
            throw new Error("Invalid OTP");
        }

        const verifyOtpResult = await otpModel.verifyOtp(username);
        if(verifyOtpResult) {
            const getRole = await userModel.getRole(username);
            const role = getRole[0].role
            const matchOtp = await bcrypt.compare(otp, verifyOtpResult[0].otp);

            if(matchOtp) {
                await userModel.changePassword(username, hashedPassword, role, formattedDate);
                //delete the otp record
                await otpModel.deleteOne(username);

                // send message to email 
                await successRegistrationEmail({
                    email: username, 
                    subject: "Password Updated Successfully", 
                    message: "Congratulations! Your password has been updated successfully."
                })

                return res.status(200).json({
                    status: "success",
                    message: "Password updated successfully.",
                });

            } else {
                return res.status(400).json({
                    status: "error",
                    message: "Invalid OTP. Please try again."
                });
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ Error: "Verify OTP error in server" });
    }
}

module.exports = { 
    changePasswordOTP,
    confirmOTP,
    confirmPassword,
};