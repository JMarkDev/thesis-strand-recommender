const otpModel = require('../models/otpModel')
const { generateOtp } = require('./generateOtp');
const { sendEmail } = require('./sendEmail');
const { AUTH_EMAIL } = process.env
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const sendOTP = async ({ email, subject, message, duration = 1 }) => {
    try {
        if (!(email && subject && message)) {
            throw Error('Email, subject and message are required');
        };

        await otpModel.deleteOne(email)

        //generate pin 
        const generatedOtp = await generateOtp();

        //send email
        const mailOptions = {
            from: AUTH_EMAIL,
            to: email,
            subject,
            html: `
            <p style="font-size: 18px; color: #333; margin-bottom: 10px;">${message}</p>

            <p style="color: tomato; font-size: 25px; letter-spacing: 2px; margin-bottom: 20px;"><b>${generatedOtp}</b></p>
        
            <p style="font-size: 16px; color: #555; margin-bottom: 10px;">Please note that this OTP is valid <b>for ${duration} minute(s)</b>.</p>
        
            <p style="font-size: 16px; color: #777; margin-top: 20px;">For security reasons, please do not share your OTP with anyone.</p>
        
            `
        };
        
        await sendEmail(mailOptions);

        //save otp record
        const hashedOtp = await bcrypt.hash(generatedOtp.toString(), saltRounds);
        const createdAt = Date.now();
        // 60000 number of milisecond in 1 minute
        const expiresAt = Date.now() + 60000 * +duration;
        const newOTP = await otpModel.sendOtp(
            email,
            hashedOtp,
            createdAt,
            expiresAt
        );
        
        return newOTP;
    } catch (error) {
        throw error;
    }
};

module.exports = { sendOTP };