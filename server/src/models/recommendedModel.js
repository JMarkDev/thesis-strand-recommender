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

const getStrandConditionModel = async () => {
    try {
        const result = await executeQuery('SELECT name, recommendationConditions FROM strand ');
        const strandConditions = result.map((strand) => {
            return {
                name: strand.name,
                recommendationConditions: JSON.parse(strand.recommendationConditions)
            }
        })
        return strandConditions;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = {
    getStrandConditionModel
}