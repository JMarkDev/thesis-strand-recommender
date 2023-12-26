const studentModel = require("../models/studentModel");
const UserModel = require("../models/userModel");
const bcrypt = require('bcryptjs');
const date = require('date-and-time');
const saltRounds = 10;

const getAllStudents = async (req, res) => {
    try {
        const students = await studentModel.getAllStudents();
        return res.json(students);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const getStudentbyId = async (req, res) => {
    const { id } = req.params;
    try {
        const student = await studentModel.getStudentById(id);
        if(!student) {
            res.status(404).json({ message: 'Student not found'})
            return
        }
        return res.json(student);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const updateStudent = async (req, res) => {
    const { id } = req.params;
    const { name, username, password, role, gender } = req.body;

    try{
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const createdAt = new Date();
        const formattedDate = date.format(createdAt, 'YY/MM/DD HH:mm:ss');

        const updateResult = await studentModel.updateStudent(id, name, username, hashedPassword, role, gender, formattedDate);
        return res.status(200).json({ status: "success", message: "Student updated successfully", updateResult });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: error.message });
    }
}

const deleteStudent = async (req, res) => {
    const { id } = req.params;
    try {
        const deleteResult = await studentModel.deleteStudent(id);
        if (deleteResult.status ==='success') {
            return res.json({ status: "success", message: "Student deleted successfully" });
        } else {
            return res.status(400).json({ status: "error", message: deleteResult.message });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: error.message });
    }
}

const searchStudent = async (req, res) => {
    const { name } = req.params;
    try {
        const searchResult = await studentModel.searchStudent(name);
        return res.json(searchResult);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: error.message });
    }
}   

// const getRecommended = async (req, res) => {
//     const { title } = req.params;
//     try {
//         const recommendedResult = await studentModel.getRecommended(title);
//         res.json(recommendedResult);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ status: "error", message: error.message });
//     }
// }

const updateRecommended = async (req, res) => {
    const { id } = req.params;
    const { recommended } = req.body;

    try {
        const recommendedResult = await studentModel.updateRecommended(id, recommended);
        return res.status(200).json({ status: "success", message: "Student updated successfully", recommendedResult });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: error.message });
    }
}

const getAllRecommendedStrand = async (req, res) => {
    try {
        const recommendedResult = await studentModel.getAllRecommended();
        res.json(recommendedResult);
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "error", message: err.message });
    }
}

const filterRecommended = async (req, res) => {
    const { recommended } = req.params;
    try{
        const filterResult = await studentModel.filterRecommended(recommended);
        return res.status(200).json(filterResult);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: error.message });
    }
}

module.exports = {
    getAllStudents,
    getStudentbyId,
    updateStudent,
    deleteStudent,
    searchStudent,
    // getRecommended,
    updateRecommended,
    getAllRecommendedStrand,
    filterRecommended,
};