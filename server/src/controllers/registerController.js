const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const UserModel = require("../models/userModel");
const otpModel = require("../models/otpModel");
const date = require('date-and-time');
const saltRounds  = 10;
// const { sendVerificationOTP } = require('../utils/sendVerificationOTP')
const otpController = require('../controllers/otpController')
const handleRegister = async (req, res) => {
  const { name, username, password, confirmPassword, role, gender } = req.body;
  // request confirm password but not save in database

  try { 
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const createdAt = new Date();
    const formattedDate = date.format(createdAt, 'YY/MM/DD HH:mm:ss');
    
    const usernameExists = await UserModel.checkIfUsernameExists(username);
    const isUserVerified = await UserModel.checkVerifiedUserEmail(username, role);

    if (usernameExists && isUserVerified) {
      return res.status(400).json({ 
        status: "error", 
        message: "Username already taken. Try another one." 
      });
    } else {
      // Delete unverified user
      if(!isUserVerified) {
        await UserModel.deleteUnverifiedUser(username, role);
      }
      // Delete unverified user's OTP
      await otpModel.deleteOne(username);
      // send OTP to gmail
      const createdOTP = await otpController.postOtp(username);
      await UserModel.registerUser(name, username, hashedPassword, role, gender, formattedDate);
      return res.status(200).json({ 
        status: "success",
        message: `Verification OTP sent to ${username}.`, 
        createdOTP 
      });
    } 
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ Error: "Register error in server" });
  }
}

module.exports = { handleRegister };


