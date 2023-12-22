const otpModel = require('../models/otpModel');
const userModel = require('../models/userModel');
const { sendOTP } = require('../utils/sendOTP')
const { sendVerificationOTP } = require('../utils/sendVerificationOTP')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const { successRegistrationEmail } = require('../utils/successRegistrationEmail');
const postOtp = async (username) => {
    try {
      // Your existing code for generating and sending OTP
      const createdOTP = await sendOTP({
        email: username,
        subject: "Strand Recommender Verification Code",
        message: "Verify your email with the code below.",
        duration: 5,
      });
  
      return createdOTP; // Return the created OTP
    } catch (error) {
      console.error(error);
      throw new Error('Error generating and sending OTP');
    }
  };

const verifyOtp = async (req, res) => {
    const { otp, email, role } = req.body;

    try {
        const userData = await userModel.getUserLogin(email);

        // Ensure OTP record exists
        const matchedOTPRecord = await otpModel.otpFindOne(email);

        const { result } = matchedOTPRecord;
        const { expiresAt } = result[0];  // Assuming result is an array 
 
        // Ensure that the otpModel.verifyOtp(email) is awaited before proceeding
        const verifyOtpResult = await otpModel.verifyOtp(email);

        if (verifyOtpResult.length > 0) {
            const matchOtp = await bcrypt.compare(otp, verifyOtpResult[0].otp);
            if (matchOtp && expiresAt > Date.now()) {
                // Update user status to "verified"
                await userModel.updateUserStatus(email, role);

                // wait for the email to be verified before generating token
                const verified = await userModel.checkVerifiedUserEmail(email, role);
                
                // delete OTP after verification
                await otpModel.deleteOne(email);

                if(verified) {
                    const { name, role, id: userId } = userData[0];

                    const token = jwt.sign({ name, role, userId }, 'your-secret-key', { expiresIn: '1d' });

                     // Set a secure HTTP-only cookie
                     res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

                    // Send success registration email
                    await successRegistrationEmail({
                        email: email, 
                        subject: "Strand Recommender Registration Successful", 
                        message: "Thank you for registering. Your account has been successfully created."
                    })

                    return res.status(200).json({ 
                        status: "success", 
                        message: "Registration successful", 
                        role,
                        userId 
                    });
                } else {
                    return res.status(400).json({ 
                        status: "error", 
                        message: registrationResult.message 
                    });
                }
              } else if (expiresAt < Date.now() && matchOtp){
                // If OTP is expired but still matches, indicate failure in the response
                return res.status(200).json({ 
                    verified: false, 
                    message: "Code has expired. Request for a new one"
                });
              } else {
                // If OTP doesn't match, indicate failure in the response
                return res.status(200).json({ 
                    verified: false, 
                    message: "Invalid OTP. Please try again."
                });
              }
        } else {
            // If no matching OTP record is found, indicate failure in the response
            return res.status(200).json({ 
                verified: false, 
                message: "Invalid OTP. Please try again."
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if(!email) throw Error("An email is required!");

        // Delete existing OTP record
        await otpModel.deleteOne(email)

        const createdOTP = await sendOTP({
            email,
            subject: "Strand Recommender Verification Code",
            message: "Verify your email with the code below.",
            duration: 5,
        });
        
        return res.status(200).json({
            status: "success",
            message: `Successfully resent OTP to ${email}`,
            createdOTP
        });

    } catch (error) {
        return res.status(400).send(error.message)
    }
}

const deleteOTP = async (req, res) => {;
    try {
        const { email } = req.params
        await otpModel.deleteOne(email) 
        return res.status(200).json({ message: 'OTP record deleted' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const emailVerification = async (req, res) => {
    try {
        const { email } = req.body;
        if(!email) throw Error("An email is required!");

        const createdEmailVerificationOTP = await sendVerificationOTP(email);
        res.status(200).json(createdEmailVerificationOTP);
    } catch (error) {
        res.status(400).send(error.message)
    }
}

// const verifyUserEmail = async (req, res) => {
//     try {
//         const { email, otp } = req.body;
//         if(!(email && otp)) throw Error("Email and OTP are required!");

//         await 
//         res.status(200).json({ message: "Email verified successfully." });
//     } catch (error) {
//         res.status(400).send(error.message)
//     }
// }


module.exports = { 
    postOtp,
    verifyOtp,
    resendOTP,
    deleteOTP,
    emailVerification
};