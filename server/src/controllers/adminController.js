const adminModel = require("../models/adminModel");
const bcrypt = require('bcryptjs');
const date = require('date-and-time');
const saltRounds = 10;
const otpModel = require('../models/otpModel');

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

module.exports = {
    getAllAdmin,
    getAdminById,
    updateAdmin,
    deleteAdmin,
    searchAdmin
}