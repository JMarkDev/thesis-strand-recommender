const Database = require("../configs/Database");
const db = new Database();
const conn = db.connection;

const executeQuery = async (query, values) => {
    return new Promise((resolve, reject) => {
        conn.query(query, values, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};
const getAllRanking = async () => {
    try {
        const query = "SELECT * FROM ranking";
        const result = await executeQuery(query);
        return result;
    } catch (error) {
        throw error;
    }
}

const getRankingByStudentId = async (studentId) => {
    try {
        const query = "SELECT * FROM ranking WHERE studentId =?";
        const result = await executeQuery(query, [studentId]);
        return result;
    } catch (error) {
        throw error;
    }
}

const addRanking = async (studentId, strandRanking) => {
    try {
        const getRanking = await getRankingByStudentId(studentId);

        if (getRanking.length > 0) {
            await deleteRanking(studentId);
        }

        const query = "INSERT INTO ranking (studentId, strandRanking) VALUES (?, ?)";
        const result = await executeQuery(query, [studentId, strandRanking]);
        return result;
    } catch (error) {
        throw error;
    }
}

const updateRanking = async (studentId, strandRanking) => {
    try {
        const query = "UPDATE ranking SET strandRanking = ? WHERE studentId = ?";
        const result = await executeQuery(query, [strandRanking, studentId]);
        return result;
    } catch (error) {
        throw error;
    }
}

const deleteRanking = async (studentId) => {
    try {
        const query = "DELETE FROM ranking WHERE studentId = ?";
        const result = await executeQuery(query, [studentId]);
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getAllRanking,
    getRankingByStudentId,
    addRanking,
    updateRanking,
    deleteRanking
}