const Database = require("../configs/Database");
const gradesController = require("../controllers/gradesController")

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

const getAllGrades = async () => {
    try {
        const result = await executeQuery("SELECT * FROM grades");
        return result;
    } catch (error) {
        console.error('Error getting all grades:', error);
        throw error;
    }
};

const getGradesById = async (studentId) => {
    try {
        const result = await executeQuery("SELECT * FROM grades WHERE studentId = ?", [studentId]);
        return result;
    } catch (error) {
        console.error('Error getting grades by ID:', error);
        throw error;
    }
};
const addGrades = async (studentId, math, science, english, mapeh, arpan, filipino, esp, average, course, strand) => {
    try {
        const result = await executeQuery("INSERT INTO grades (studentId, math, science, english, mapeh, arpan, filipino, esp, average, course, strand) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
        [studentId, math, science, english, mapeh, arpan, filipino, esp, average, course, strand]);

        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const updateGrades = async (studentId, math, science, english, mapeh, arpan, filipino, esp, average, course, strand) => {
    try {
        const result = await executeQuery("UPDATE grades SET math =?, science =?, english =?, mapeh =?, arpan =?, filipino =?, esp =?, average =?, course =?, strand =? WHERE studentId =?", 
        [math, science, english, mapeh, arpan, filipino, esp, average, course, strand, studentId]);
        return {status: "success", result };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const deleteGrades = async (studentId) => {
    try {
        const result = await executeQuery("DELETE FROM grades WHERE studentId = ?", [studentId]);
        return {status: "success", result };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = {
    getAllGrades,
    getGradesById,
    addGrades,
    updateGrades,
    deleteGrades
}