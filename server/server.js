const express = require("express");
const Database = require("./src/configs/Database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const SERVER_PORT = process.env.PORT || 3001;
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// const recommendedRoute = require("./src/Routes/Recommended.js")

// const filteredRecommendedRoute = require("./src/Routes/FilterRecommeded.js")
const otpRoute = require("./src/Routes/otpRoute.js")
const verifyUser = require("./src/middleware/verifyUser.js")
const registerRoute = require("./src/Routes/registerRoute.js")
const loginRoute = require("./src/Routes/loginRoute.js")
const logoutRoute = require("./src/Routes/logoutRoute.js")
const studentsRoute = require("./src/Routes/studentsRoute.js")
const adminRoute = require("./src/Routes/adminRoute.js")
const strandRoute = require("./src/Routes/strandRoute.js")
const courseRoute = require("./src/Routes/courseRoute.js")
const gradesRoute = require("./src/Routes/gradesRoute.js")
const rankingRoute = require("./src/Routes/rankingRoute.js")
const recommendedRoute = require("./src/Routes/recommendedRoute.js")

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["POST", "GET", "DELETE", "PUT"],
  credentials: true
}));

app.use(cookieParser());

require('dotenv/config');

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  res.sendFile(`${__dirname}/uploads/${filename}`);
});

app.use(express.json())

// app.use('/recommended', recommendedRoute);
app.use('/otp', otpRoute);
app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/logout', logoutRoute);
app.use('/students', studentsRoute);
app.use('/admin', adminRoute);
app.use('/strand', strandRoute);
app.use('/course', courseRoute);
app.use('/grades', gradesRoute);
app.use('/ranking', rankingRoute);
app.use('/recommended', recommendedRoute)


app.get('/', verifyUser,(req, res) => {
  return res.json({ Status: "Success", name: req.name });
});

app.listen(SERVER_PORT, function () {
  const db = new Database();
  db.TestConnection();
  console.log("Server is up and running at http://localhost:3001");
});