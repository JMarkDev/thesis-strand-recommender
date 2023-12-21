const bcrypt = require("bcryptjs");
const date = require('date-and-time');
const userModel = require("../models/userModel");
const saltRounds = 10;
const { sendOTP } = require('../utils/sendOTP')
const otpModel = require('../models/otpModel');
const { successRegistrationEmail } = require('../utils/successRegistrationEmail')

const handleChangePassword = async (req, res) => {
    const { username} = req.body;
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

const sendOTPVerification = async (username) => {
    try{
        const createdOTP = await sendOTP({
            email: username,
            subject: "Password Reset",
            message: "Verify your email with the code below.",
            duration: 5,
        });
        return createdOTP;
    } catch (error) {
        console.log(error)
        throw new Error("Error sending OTP")
    }
}

const verifyOTP = async (req, res) => {
    try {
        const { username, password,  otp } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const createdAt = new Date();
        const formattedDate = date.format(createdAt, 'YY/MM/DD HH:mm:ss');
        
        if(!(username && otp)) throw Error("Username and OTP are required!");

        // Ensure OTP record exists
        const matchedOTPRecord = await otpModel.otpFindOne(username);

        if (!matchedOTPRecord) {
            return res.status(400).json({ message: 'OTP record not found' });
        }

        const { result } = matchedOTPRecord;
        const { expiresAt } = result[0];  // Assuming result is an array 

        // Check if OTP is expired
        if (expiresAt < Date.now()) {
            await otpModel.deleteOne(username);
            throw new Error("Code has expired. Request for a new one");
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
                    subject: "Password Change Successful", 
                    message: "Your password has been successfully changed."
                })

                return res.status(200).json({
                    status: "success",
                    message: "Password change successfully.",
                });

            } else {
                return res.status(400).json({
                    status: "error",
                    message: "OTP does not match. Please enter a valid OTP."
                });
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ Error: "Verify OTP error in server" });
    }
}

module.exports = { 
    handleChangePassword,
    verifyOTP
};