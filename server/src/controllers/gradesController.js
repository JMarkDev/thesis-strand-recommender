const gradesModel = require("../models/gradesModel");

const getAllGrades = async (req, res) => {
    try {
        const result = await gradesModel.getAllGrades();
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const getGradesById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await gradesModel.getGradesById(id);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const addGrades = async (req, res) => {
    const { studentId, math, science, english, mapeh, arpan, filipino, esp, average, course } = req.body;
    
    try {
        const result = await gradesModel.addGrades(studentId, math, science, english, mapeh, arpan, filipino, esp, average, course);
        res.status(201).json({ status: "success", message: "Grades added successfully", result});
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const updateGrades = async (req, res) => {
    const { studentId } = req.params;
    const { math, science, english, mapeh, arpan, filipino, esp, average, course } = req.body;

    try {
        const result = await gradesModel.updateGrades(studentId, math, science, english, mapeh, arpan, filipino, esp, average, course);
        res.status(200).json({ status: "success", message: "Grades updated successfully", result});
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = {
    getAllGrades,
    getGradesById,
    addGrades,
    updateGrades
}