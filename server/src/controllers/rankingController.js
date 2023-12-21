const rankingModel = require('../models/rankingModel');

const getAllRanking = async (req, res) => {
    try {
        const result = await rankingModel.getAllRanking();
        res.status(200).json({ status: 'success', data: result })
    } catch (error) {
        throw error;
    }
}

const getRankingByStudentId = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await rankingModel.getRankingByStudentId(id);
        res.status(200).json({ status:'success', data: result })
    } catch (error) {
        throw error;
    }
}

const addRanking = async (req, res) => {
    const { studentId, strandRanking } = req.body;
    try {
        const result = await rankingModel.addRanking(studentId, strandRanking);
        res.status(200).json({ status: 'success', message: 'Ranking added successfully', data: result })
    } catch (error) {
        throw error;
    }
}

const updateRanking = async (req, res) => {
    const { studentId, strandRanking } = req.body;
    try {
        const result = await rankingModel.updateRanking(studentId, strandRanking);
        res.status(200).json({ status:'success', message: 'Ranking updated successfully', data: result })
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getAllRanking,
    getRankingByStudentId,
    addRanking,
    updateRanking
}
