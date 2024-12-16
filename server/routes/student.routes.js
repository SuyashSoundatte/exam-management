const express = require('express');
const rateLimit = require("express-rate-limit");
const router = express.Router();
const { registerStudent, viewResult, getAllStudents, updateStudentMarks, generateHallTicket } = require('../controllers/student.controller');
const { registerValidation, viewResultValidation } = require("../middlewares/student.middleware");
const { adminAuth } = require("../middlewares/admin.middleware");

const formLimiter = rateLimit({
  max: 115,
  windowMs: 60 * 60 * 1000,
  message: {
    status: 429,
    error: "Too many form submissions. Please try again after an hour.",
  },
});

const resultLimiter = rateLimit({
  max: 20, 
  windowMs: 60 * 60 * 1000,
  message: {
    status: 429,
    error: "Too many result queries. Please try again later.",
  },
});

const hallTicketLimiter = rateLimit({
  max: 10, // Example limit: 10 requests per hour
  windowMs: 60 * 60 * 1000,
  message: {
    status: 429,
    error: "Too many hall ticket requests. Please try again later.",
  },
});

router.post('/register', formLimiter, registerValidation, registerStudent);
router.get('/viewResult', resultLimiter, viewResultValidation, viewResult);
router.get("/allStudents",  getAllStudents);
// router.get("/getHallTicket", hallTicketValidation)
router.get("/getHallTicket", hallTicketLimiter, generateHallTicket)

module.exports = router;
