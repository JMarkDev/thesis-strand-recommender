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
        // if(result.length > 0) {
        //     result[0].recommendationConditions = JSON.parse(result[0].recommendationConditions);
        // }
        // console.log(result)
        return result;
    } catch (error) {
        console.error(error);
        throw error; 
    }
}

const getStrandByName = async (name) => {
    try {
        const result = await executeQuery('SELECT * FROM strand WHERE name =?', [name]);
        return result;
    } catch (error) {
        console.log(error);
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

const getTotalStrandRecommended = async () => {
    try {
        const result = await executeQuery(`SELECT s.name AS strand, COUNT(r.recommended) AS recommendedCount
        FROM strand AS s
        LEFT JOIN student AS r ON s.name = r.recommended
        GROUP BY s.name
         `)
        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const getMonthlyData = async (selectedYear) => {
    try {
        //Step 1 query available strand names 
        const strandQuery = 'SELECT name from strand';

        const strandResults = await executeQuery(strandQuery);

        // Dynamically generate CASE statements base on the strand names
        const caseStatements = strandResults.map((row) => {
            const strandName = row.name;
            return `SUM(CASE WHEN s.name = '${strandName}' THEN 1 ELSE 0 END) AS ${strandName}`;
        });

        // Step 3: Construct the dynamic query
        const dynamicQuery = `
                SELECT
                    monthName AS month,
                    ${caseStatements.join(', ')}
                FROM (
                SELECT 1 AS monthIndex, 
                'Jan ${selectedYear}' AS monthName
                UNION SELECT 2, 'Feb ${selectedYear}'
                UNION SELECT 3, 'Mar ${selectedYear}'
                UNION SELECT 4, 'Apr ${selectedYear}'
                UNION SELECT 5, 'May ${selectedYear}'
                UNION SELECT 6, 'Jun ${selectedYear}'
                UNION SELECT 7, 'Jul ${selectedYear}'
                UNION SELECT 8, 'Aug ${selectedYear}'
                UNION SELECT 9, 'Sep ${selectedYear}'
                UNION SELECT 10, 'Oct ${selectedYear}'
                UNION SELECT 11, 'Nov ${selectedYear}'
                UNION SELECT 12, 'Dec ${selectedYear}'
                ) AS months
                LEFT JOIN student AS r ON months.monthName = DATE_FORMAT(r.createdAt, '%b %Y')
                LEFT JOIN strand AS s ON r.recommended = s.name
                GROUP BY month
            `;

            {/*
            add this when the months are not in order
            GROUP BY month
            ORDER BY months.monthIndex;
            */}

        // Step 4: Execute the dynamic query 
        const results = await executeQuery(dynamicQuery);

        // Step 5: Clean and format the results 
        const cleanedResults = results.map((result) => ({
            ...result,
            month: result.month.split(' ')[0]   // // Get only the first part of the month string
        }));

        return cleanedResults
        
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    getAllStrand,
    getStrandById,
    getStrandByName,
    addStrand,
    updateStrand,
    deleteStrand,
    strandNameExists,
    getTotalStrandRecommended,
    getMonthlyData
}