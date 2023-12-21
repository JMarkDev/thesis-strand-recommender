const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const UserModel = require("../models/userModel");

const handleLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const userData = await UserModel.getUserLogin(username);
        const checkVerifiedUserEmail = await UserModel.checkVerifiedUserEmail(username);

            if (userData.length > 0 && checkVerifiedUserEmail) {
                const passwordMatch = await bcrypt.compare(password, userData[0].password);

                if (passwordMatch) {
                    const { name, role, id: userId } = userData[0];

                    const token = jwt.sign({ name, role, userId }, "jwt-secret-key", { expiresIn: '1d' });

                    // Set a secure HTTP-only cookie
                    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

                    return res.status(200).json({ 
                        status: "success", 
                        message: "Login Successful", 
                        role, 
                        userId 
                    });
                } else {
                    return res.status(400).json({ status: "error", message: "Invalid password!" });
                }
            } else {
                return res.status(400).json({ status: "error", message: "Invalid username or password!" });
            }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Login error in server", error: error.message });
    }
}

module.exports = { handleLogin };
