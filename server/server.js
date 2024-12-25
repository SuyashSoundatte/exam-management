const express = require("express");
const session = require("express-session");
const app = express();
require('dotenv').config();
require("./config/db");
const cors = require('cors');
const cookieParser = require("cookie-parser");



const adminRoutes = require("./routes/admin.routes");
const studentRoutes = require("./routes/student.routes");

const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET, 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true, httpOnly: true }
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    // Allow all origins
    callback(null, true);
  },
  credentials: true, // Allow cookies to be sent and received
}));




app.use("/admin", adminRoutes);
app.use("/student", studentRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Exam Management System");
});


app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(port, () => {
  
  console.log(`Server running at http://localhost:${port}`);
});
