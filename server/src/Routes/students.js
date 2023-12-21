const express = require("express");
const Database = require("../configs/Database");
const router = express.Router();
const bcrypt = require("bcryptjs");
const salt = 5;
const date = require('date-and-time');

// router.get("/fetch", async (req, res) => {
//   const db = new Database();
//   const conn = db.connection;

//   // Obtain the role query parameter from the request
//   const userRole = req.query.role;

//   // Modify the SQL query to filter based on the user's role
//   let query = "SELECT * FROM register";

//   if (userRole === "student") {
//     query += " WHERE role = 'student'";
//   } else if (userRole === "admin") {
//     query += " WHERE role = 'admin'";
//   }

//   try {
//     await conn.connect();

//     conn.query(query, (err, result) => {
//       if (err) throw err;
//       res.json(result);
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   } finally {
//     conn.end();
//   }
// });


// router.get("/:id", async (req, res) => {
//   const { id } = req.params;
//   const db = new Database();
//   const conn = db.connection;
//   const query = "SELECT * FROM register WHERE id = ?";

//   try {
//     await conn.connect();

//     conn.query(query, [id], (error, rows) => {
//       if (error) throw error;
//       res.json(rows);
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   } finally {
//     conn.end();
//   }
// });

// router.put('/update/:id', async (req, res) => {
//   const db = new Database();
//   const conn = db.connection;

//   try {
//     const { id } = req.params;
//     const { name, username, password, gender, role } = req.body;

//     if (!name || !username || !password || !role || !gender) {
//       return res.status(400).json({ Error: "Missing required fields" });
//     }

//     // Check if the username already exists
//     const usernameExists = await new Promise((resolve, reject) => {
//       const checkQuery = 'SELECT COUNT(*) as count FROM register WHERE username = ?';
//       conn.query(checkQuery, [username], (err, result) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(result && result[0] && result[0].count > 0);
//         }
//       });
//     }).catch(error => {
//       console.error('Promise rejected:', error);
//       throw error;
//     });

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const query = "UPDATE register SET name = ?, username = ?, password = ?, gender = ?, updatedAt = ? WHERE id = ?";
//     const updatedAt = new Date();
//     const formattedDate = date.format(updatedAt, 'YY/MM/DD HH:mm:ss');

//     const values = [
//       name,
//       username,
//       hashedPassword,
//       gender,
//       formattedDate,
//       id
//     ];

//     conn.query(query, values, (err, result) => {
//       if (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Internal server error' });
//       } else {
//         console.log(result);
//         res.json({ message: "Updated successfully" });
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   } finally {
//     conn.end();
//   }
// });

router.put('/update/password/:id', async (req, res) => {
  const db = new Database();
  const conn = db.connection;

  const { id } = req.params;
  const { password} = req.body;

  try {
    const updateQuery = 'UPDATE register SET password = ?, updatedAt = ? WHERE id = ?';
    const hashedPassword = await bcrypt.hash(password, salt);

    const updatedAt = new Date();
    const formattedDate = date.format(updatedAt, 'YY/MM/DD HH:mm:ss');
    const values = [hashedPassword, formattedDate, id];

    conn.query(updateQuery, values, (err, result) => {
      if (err) {
        console.error('Error updating password:', err);
        res.status(500).json({ message: 'Internal server error' });
      } else {
        console.log('Password updated successfully');
        res.json({ message: 'Password updated successfully' });
      }
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} )


// router.delete('/delete/:id', async (req, res) => {
//   const db = new Database();
//   const conn = db.connection;

//   const { id } = req.params;
//   const query = "DELETE FROM register WHERE id = ?";

//   try {
//     await conn.connect();

//     conn.query(query, id, (error, result) => {
//       if (error) throw error;
//       console.log(result);
//       res.json(result);
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   } finally {
//     conn.end();
//   }
// });

// Search route
// router.get("/search/:name", async (req, res) => {
//   const { name } = req.params;
//   const db = new Database();
//   const conn = db.connection;
//   const query = "SELECT * FROM register WHERE Name LIKE ?";

//   try {
//     await conn.connect();

//     conn.query(query, [`%${name}%`], (error, rows) => {
//       if (error) throw error;
//       res.json(rows);
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   } finally {
//     conn.end();
//   }
// });

// Update Recommended Route
// router.put('/update-recommended/:id', async (req, res) => {
//   const db = new Database();
//   const conn = db.connection;

//   const { id } = req.params;
//   const { recommended, strand } = req.body;

//   try {
//     const updateQuery = 'UPDATE register SET recommended = ?, strand = ? WHERE id = ?';
//     const values = [recommended, strand, id];

//     conn.query(updateQuery, values, (err, result) => {
//       if (err) {
//         console.error('Error updating recommended:', err);
//         res.status(500).json({ message: 'Internal server error' });
//       } else {
//         console.log('Recommended updated successfully');
//         res.json({ message: 'Recommended updated successfully' });
//       }
//     });
//   } catch (error) {
//     console.error('Update error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });


module.exports = router;