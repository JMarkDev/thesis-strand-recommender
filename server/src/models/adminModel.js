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

const getAllAdmin = async () => {
    try {
        const result = await executeQuery('SELECT * FROM admin WHERE status = "verified"'); 
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getAdminById = async (id) => {
    try {
        const result = await executeQuery('SELECT * FROM admin WHERE id =?', [id]);
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const updateAdmin = async (id, name, username, hashedPassword, role, gender, formattedDate) => {
    try {
        const result = await executeQuery('UPDATE admin SET name =?, username =?, password =?, role =?, gender =?, updatedAt =? WHERE id =?', 
        [name, username, hashedPassword, role, gender, formattedDate, id]);
        return {status: "success", result };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const deleteAdmin = async (id) => {
    try{
        const result = await executeQuery('DELETE FROM admin WHERE id =?', [id]);
        return {status: "success", result };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const searchAdminQuery = async (name) => {
    try {
        const result = await executeQuery("SELECT * FROM admin WHERE LOWER(name) LIKE LOWER(?)", [`${name}%`]);
        console.log('test')
        return { status: "success", data: result };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const updateUsername = async (id, username, formattedDate) => {
    try {
        const result = await executeQuery('UPDATE admin SET username =?, updatedAt =? WHERE id =?', [username, formattedDate, id]);
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = {
    getAllAdmin,
    getAdminById,
    updateAdmin,
    deleteAdmin,
    searchAdminQuery,
    updateUsername
};
