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

const sendOtp = async (email, hashedOtp, createdAt, expiresAt) => {
    try{
        const result = await executeQuery('INSERT INTO otp (email, otp, createdAt, expiresAt) VALUES (?,?,?,?)',
        [email, hashedOtp, createdAt, expiresAt])
        return {status: "success", result };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const deleteOne = async (email) => {
    try {
        const result = await executeQuery('DELETE FROM otp WHERE email = ?', [email]);
        return { status: "success", result };
    } catch (error) {
        throw error;
    }
};

const verifyOtp = async (email) => {
    const sql = 'SELECT id, otp FROM otp WHERE email = ?';
    try {
        const result = await executeQuery(sql, [email]);
        return result;
    } catch (error) {
        throw error;
    }
};

const checkExistingUser = async (email) => {
    const checkQuery = 'SELECT COUNT(*) as count FROM otp WHERE email = ?'
    try {
        const result = await executeQuery(checkQuery, [email])
        return result.some((result) => result.count > 0)
    } catch (error) {
        console.error(error);
        throw error;
    }
}


const otpFindOne = async (email) => {
    try {
        const result = await executeQuery('SELECT * FROM otp WHERE email =?', [email])
        return {status: "success", result };
    } catch (error) {
        throw error;
    }
}

// const updateOtp = async (email, hashedOtp, createdAt, expiresAt) => {
//     try {
//         const result = await executeQuery('UPDATE otp SET otp = ?, createdAt = ?, expiresAt = ? WHERE email = ?', [hashedOtp, createdAt, expiresAt, email])
//         return {status: "success", result };
//     } catch (error) {
//         throw error;
//     }
// }

module.exports = {
    sendOtp,
    deleteOne,
    verifyOtp,
    otpFindOne,
    checkExistingUser,
    // updateOtp
}


