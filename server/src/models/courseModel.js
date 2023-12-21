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

const getAllCourse = async () => {
    try {
        const result = await executeQuery('SELECT * FROM course');
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const getCourseById = async (id) => {
    try {
        const result = await executeQuery('SELECT * FROM course WHERE id =?', [id]);
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const addCourse = async (title, description, image, strand, formattedDate) => {
    try {
        const result = await executeQuery('INSERT INTO course (title, description, image, strand, createdAt) VALUES (?,?,?,?,?)', 
        [title, description, image, strand, formattedDate]);
        return {status: "success", result };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const updateCourse = async (id, title, description, image, strand, formattedDate) => {
    try {
        const result = await executeQuery('UPDATE course SET title=?, description=?, image=?, strand=?, updatedAt=? WHERE id =?', 
        [title, description, image, strand, formattedDate, id]);
        return {status: "success", result };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const deleteCourse = async (id) => {
    try{
        const result = await executeQuery('DELETE FROM course WHERE id =?', [id]);
        return {status: "success", result };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const courseTitleExists = async (title) => {
    try {
        const result = await executeQuery('SELECT * FROM course WHERE title = ?', [title]);
        return result.length > 0;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
const getCourseByStrand = async (strand) => {
    try {
        const result = await executeQuery('SELECT * FROM course WHERE strand =?', [strand]);
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = {
    getAllCourse,
    getCourseById,
    addCourse,
    updateCourse,
    deleteCourse,
    courseTitleExists,
    getCourseByStrand
}