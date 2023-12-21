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

const getUserLogin = async (username) => {
    const sql = `
        SELECT id, username, password, role FROM admin WHERE username = ? 
        UNION 
        SELECT id, username, password, role FROM student WHERE username = ?
    `;
    try {
        const result = await executeQuery(sql, [username, username]);
        return result;
    } catch (error) {
        console.error("User login error:", error);
        throw error;
    }
};

const generateInsertQuery = (role) => {
    return `INSERT INTO ${role} (name, username, password, role, gender, createdAt) VALUES (?,?,?,?,?,?)`
};

const registerUser = async (name, username, hashedPassword, role, gender, formattedDate) => {
    try {
        const insertQuery = generateInsertQuery(role);
        await executeQuery(insertQuery, [name, username, hashedPassword, role, gender, formattedDate]);
        return { status: "success"};
    } catch (error) {
        console.error("User registration error:", error);
        throw error;
    }
};

const checkIfUsernameExists = async (username) => {
    const checkQuery = `
        SELECT COUNT(*) as count FROM student WHERE username = ?
        UNION
        SELECT COUNT(*) as count FROM admin WHERE username = ?
    `;
    try {
        const results = await executeQuery(checkQuery, [username, username]);
        return results.some((result) => result.count > 0);
    } catch (error) {
        console.error("Check username existence error:", error);
        throw error;
    }
};

const checkVerifiedUserEmail = async (username) => {
    const checkQuery = `
        SELECT COUNT(*) as count FROM student WHERE username = ? AND status = 'verified'
        UNION
        SELECT COUNT(*) as count FROM admin WHERE username = ? AND status = 'verified'
    `;
    try {
        const results = await executeQuery(checkQuery, [username, username]);
        return results.some((result) => result.count > 0);
    } catch (error) {
        console.error("Check username existence error:", error);
        throw error;
    }
};

const deleteUnverifiedUser = async (username, role) => { 
    try {
        const deleteQuery = `
            DELETE FROM ${role} WHERE username = ?
        `;
        await executeQuery(deleteQuery, [username]);
        return;
    } catch (error) {
        console.error("Delete unverified user error:", error);
        throw error;
    }
}

const updateUserStatus = async (username, role) => {
    try {
        const updateQuery = `
        UPDATE ${role} SET status = 'verified' WHERE username = ?
        `;
        await executeQuery(updateQuery, [username]);
        return;
    } catch (error) {
        console.error("Update status error:", error);
        throw error;
    }
}

const updateAdminStatus = async (username) => {
    try {
        const updateAdminQuery = `
            UPDATE admin SET status = 'verified' WHERE username = ?
        `;
        await executeQuery(updateAdminQuery, [username]);
        return;
    } catch (error) {
        console.error("Update status error:", error);
        throw error;
    }
}

const updateStudentStatus = async (username) => {
    try {
        const updateStudentsQuery = `
            UPDATE student SET status = 'verified' WHERE username = ?
        `;
        await executeQuery(updateStudentsQuery, [username]);
        return;
    } catch (error) {
        console.error("Update status error:", error);
        throw error;
    }
}

const changePassword = async (username, hashedPassword, role, formattedDate) => {
    try {
        if (typeof role !== 'string') {
            throw new Error('Role must be a string representing the table name.');
        }

        const updatePasswordQuery = `
            UPDATE ${role} SET password = ?, updatedAt = ? WHERE username = ?
        `;
        await executeQuery(updatePasswordQuery, [hashedPassword, formattedDate, username]);
        return { status: 'success', message: 'Password updated successfully' };
    } catch (error) {
        console.error("Update password error:", error);
        throw error;
    }
};


const getRole = async (username) => {
    const sql = `
        SELECT role FROM admin WHERE username = ? 
        UNION 
        SELECT role FROM student WHERE username = ?
    `;
    try {
        const result = await executeQuery(sql, [username, username]);
        return result;
    } catch (error) {
        console.error("Get role error:", error);
        throw error;
    }
};

// const updateStatus = async (username) => {
//     try {
//         // Update status for students
//         const updateStudentsQuery = `
//             UPDATE students SET status = 'verified' WHERE username = ?
//         `;
//         await executeQuery(updateStudentsQuery, [username]);

//         // Update status for admin
//         const updateAdminQuery = `
//             UPDATE admin SET status = 'verified' WHERE username = ?
//         `;
//         await executeQuery(updateAdminQuery, [username]);

//         return;
//     } catch (error) {
//         console.error("Update status error:", error);
//         throw error;
//     }
// };



module.exports = { 
    getUserLogin, 
    registerUser, 
    checkIfUsernameExists,
    checkVerifiedUserEmail,
    updateAdminStatus,
    updateStudentStatus,
    deleteUnverifiedUser,
    changePassword,
    getRole,
    updateUserStatus
};
