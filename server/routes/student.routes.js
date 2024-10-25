const express = require('express');
const router = express.Router();
const { registerStudent, viewResult } = require('../controllers/student.controller');
const { registerValidation, viewResultValidation } = require("../middlewares/student.middleware");

router.post('/register', registerValidation, registerStudent);
router.post('/viewResult', viewResultValidation, viewResult);

module.exports = router;
