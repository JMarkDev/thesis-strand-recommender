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

const getAllStudents = async () => {
    try {
        const result = await executeQuery('SELECT * FROM student WHERE status = "verified"');
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getStudentById = async (id) => {
    try {
        const result = await executeQuery('SELECT * FROM student WHERE id =?', [id]);
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const updateStudent = async (id, name, username, hashedPassword, role, gender, formattedDate) => {
    try {
        const result = await executeQuery(
            "UPDATE student SET name = ?, username = ?, password = ?, role = ?, gender = ?, updatedAt = ? WHERE id = ?",
            [name, username, hashedPassword, role, gender, formattedDate, id]
        );
        return { status: "success", result };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const deleteStudent = async (id) => {
    try {
        const result = await executeQuery("DELETE FROM student WHERE id =?", [id]);
        return { status: "success", result };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// const getRecommended = async (title) => {
//     try {
//         const result = await executeQuery(' SELECT strand FROM course WHERE title = ?', [title]);
//         return result;
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// }

const updateRecommended = async (id, recommended) => {
    try {
        const result = await executeQuery("UPDATE student SET recommended =? WHERE id =?", [recommended, id]);
        return { status: "success", result };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const searchStudent = async (name) => {
    try {
        const result = await executeQuery("SELECT * FROM student WHERE name LIKE ?", [`%${name}%`]);
        return { status: "success", data: result };
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const filterRecommended = async (recommended) => {
    try {
        const result = await executeQuery("SELECT * FROM student WHERE recommended = ?", [recommended]);
        return { status: "success", data: result };
    } catch (error) {
        console.error(error);
        throw error;
    }
};


module.exports = {
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    searchStudent,
    // getRecommended,
    updateRecommended,
    filterRecommended
};
