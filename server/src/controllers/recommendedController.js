const recommendedModel = require('../models/recommendedModel');
const gradesModel = require('../models/gradesModel');
// const recommendedModel = require('../models/recommendedModel');

const getStrandConditions = async (req, res) => {
    try {
        const result = await recommendedModel.getStrandConditionModel();
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const recommendStrand = async (req, res) => {
    try {
        const { 
            studentId, 
            math, 
            science, 
            english, 
            mapeh, 
            arpan, 
            filipino, 
            esp, 
            average,  
            course, 
            strand } = req.body;
            
        const result = await gradesModel.addGrades(studentId, math, science, english, mapeh, arpan, filipino, esp, average, course, strand);

        res.status(201).json({ status: "success", message: "Grades added successfully", result});
        // const getAllGrades = await gradesModel.getAllGrades();
        // console.log(getAllGrades);
        const getGradesById = await gradesModel.getGradesById(studentId);
        console.log(getGradesById)

        const getAllRecommendationConditions = await recommendedModel.getStrandConditionModel();
        console.log(getAllRecommendationConditions);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    getStrandConditions,
    recommendStrand
}