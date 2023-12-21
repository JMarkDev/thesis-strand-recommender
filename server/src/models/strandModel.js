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

const getAllStrand = async () => {
    try {
        const result = await executeQuery('SELECT * FROM strand');
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const getStrandById = async (id) => {
    try {
        const result = await executeQuery('SELECT * FROM strand WHERE id =?', [id]);
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const addStrand = async (image, name, description, recommendationConditions, formattedDate) => {
    try {
        const result = await executeQuery('INSERT INTO strand (image, name, description, recommendationConditions, createdAt) VALUES (?,?,?,?,?)', 
        [image, name, description, recommendationConditions, formattedDate]);
        return {status: "success", result };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const updateStrand = async (id, image, name, description, recommendationConditions, formattedDate) => {
    try {
        const result = await executeQuery('UPDATE strand SET image=?, name=?, description=?, recommendationConditions=?, updatedAt=? WHERE id =?', 
        [image, name, description, recommendationConditions, formattedDate, id]);
        return {status: "success", result };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const deleteStrand = async (id) => {
    try{
        const result = await executeQuery('DELETE FROM strand WHERE id =?', [id]);
        return {status: "success", result };
    } catch (error) {
        console.error(error);
        throw error;
    }
}
const strandNameExists = async (name) => {
    try {
        const result = await executeQuery('SELECT * FROM strand WHERE name =?', [name]);
        return result.length > 0;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = {
    getAllStrand,
    getStrandById,
    addStrand,
    updateStrand,
    deleteStrand,
    strandNameExists
}