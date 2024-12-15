const express = require('express');
const router = express.Router();
const { registerStudent, viewResult, getAllStudents, updateStudentMarks, generateHallTicket } = require('../controllers/student.controller');
const { registerValidation, viewResultValidation } = require("../middlewares/student.middleware");
const { adminAuth } = require("../middlewares/admin.middleware");

router.post('/register', registerValidation, registerStudent);
router.get('/viewResult', viewResultValidation, viewResult);
router.get("/allStudents",  getAllStudents);
// router.get("/getHallTicket", hallTicketValidation)
router.get("/getHallTicket", generateHallTicket)

module.exports = router;
