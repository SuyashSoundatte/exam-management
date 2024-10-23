const express = require("express");
const app = express();
require('dotenv').config();
require("./config/db");
const cors = require('cors');

// Routes
const adminRoutes = require("./routes/admin.routes");
const studentRoutes = require("./routes/student.routes");

const port = process.env.PORT || 8080;

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors());

// Routes middleware
app.use("/admin", adminRoutes);
app.use("/student", studentRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Exam Management System");
});

// 404 error for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
