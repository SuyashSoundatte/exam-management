const express = require('express');
const router = express.Router();
const { registerStudent, viewResult } = require('../controllers/student.controller');
const { registerValidation } = require("../middlewares/register.middleware");

router.post('/register', registerValidation, registerStudent);
router.post('/view-result', viewResult);

module.exports = router;
