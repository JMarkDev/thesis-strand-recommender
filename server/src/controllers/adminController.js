const adminModel = require("../models/adminModel");
const bcrypt = require('bcryptjs');
const date = require('date-and-time');
const saltRounds = 10;
const otpModel = require('../models/otpModel');
const otpController = require('../controllers/otpController');
const userModel = require('../models/userModel');
const { successRegistrationEmail } = require('../utils/successRegistrationEmail')

const getAllAdmin = async (req, res) => {
    try {
        const admins = await adminModel.getAllAdmin();
        return res.json(admins);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const getAdminById = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await adminModel.getAdminById(id);
        return res.json(admin);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const updateAdmin = async (req, res) => {
    const { id } = req.params;
    const { name, username, password, confirmPassword, role, gender } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const updatedAt = new Date();
        const formattedDate = date.format(updatedAt, 'YY/MM/DD HH:mm:ss');

        const result = await adminModel.updateAdmin(id, name, username, hashedPassword, role, gender, formattedDate);
        
        return res.status(200).json({ success: true, message: 'Admin updated successfully', result });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const deleteAdmin = async (req, res) => {
    const { id } = req.params;

    try{
        const deleteResult = await adminModel.deleteAdmin(id);
        if (deleteResult.status ==='success') {
            return res.json({ status: "success", message: "Admin deleted successfully" });
        } else {
            return res.status(400).json({ status: "error", message: deleteResult.message });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const searchAdmin = async (req, res) => {
    const { name } = req.params;
    try {
        const searchResult = await adminModel.searchAdminQuery(name);
        return res.json(searchResult);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: error.message });
    }
}   

const updateUsername = async (req, res) => {
    const { username} = req.body;

    try {
        const usernameExists = await userModel.checkIfUsernameExists(username);
        const isUserVerified = await userModel.checkVerifiedUserEmail(username);
        if (usernameExists && !isUserVerified) {
               // Delete unverified user's OTP
            await otpModel.deleteOne(username);
            // send OTP to gmail
            const createdOTP = await otpController.postOtp(username);
            return res.status(200).json({ 
                status: "success",
                message: `Verification OTP sent to ${username}.`, 
                createdOTP 
            });
        } else if (usernameExists && isUserVerified) {
            return res.status(400).json({
                status: "error",
                message: "Username has already been taken, please try another username."
            });
        } else {
             // send OTP to gmail
             const createdOTP = await otpController.postOtp(username);
             return res.status(200).json({ 
                 status: "success",
                 message: `Verification OTP sent to ${username}.`, 
                 createdOTP 
             });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ Error: "Change password error in server" });
    }
}

const VerifyOTP = async (req, res) => {
    const { id } = req.params;
    const { username, otp } = req.body; 

    try {
        const createdAt = new Date();
        const formattedDate = date.format(createdAt, 'YY/MM/DD HH:mm:ss');

         // Ensure OTP record exists
         const matchedOTPRecord = await otpModel.otpFindOne(username);

         if (matchedOTPRecord.result.length === 0) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'OTP not found. Please request a new code and try again.' 
            });
         }

         const verifyOtpResult = await otpModel.verifyOtp(username);
        
        if (verifyOtpResult) {
            const isMatch = await bcrypt.compare(otp, verifyOtpResult[0].otp);
            
            console.log(isMatch) 
            if (isMatch) {
                // Delete OTP record
                await otpModel.deleteOne(username);

                const updateUsernameResult = await adminModel.updateUsername(id, username, formattedDate);

                // send message to email 
                await successRegistrationEmail({
                    email: username, 
                    subject: "Username Updated Successfully", 
                    message: "Congratulations! Your username has been updated successfully."
                })

                return res.status(200).json({
                    status: "success",
                    message: `Successfully verified ${username}.`,
                    updateUsernameResult
                });
            } else {
                return res.status(400).json({
                    status: "error",
                    message: "Invalid OTP. Please try again."
                });
            }
        } else {
            return res.status(400).json({
                status: "error",
                message: "Invalid OTP. Please try again."
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = {
    getAllAdmin,
    getAdminById,
    updateAdmin,
    deleteAdmin,
    searchAdmin,
    updateUsername,
    VerifyOTP
}