const express = require('express');
const router = express.Router();
const { registerStudent, viewResult, getAllStudents, updateStudentMarks } = require('../controllers/student.controller');
const { registerValidation, viewResultValidation } = require("../middlewares/student.middleware");
const { adminAuth } = require("../middlewares/admin.middleware");

router.post('/register', registerValidation, registerStudent);
router.post('/viewResult', viewResultValidation, viewResult);
router.get("/allStudents",  getAllStudents);
router.post("/submitMarks", updateStudentMarks);

module.exports = router;
