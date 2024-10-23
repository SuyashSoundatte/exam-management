const express = require('express');
const router = express.Router();
const {
    registerAdmin,
    approveAdmin,
    getCollegesAndCities,
    declareResults,
    setExamDate,
    getExamSchedule,
    allocateSeats,
    viewStudents,
    viewAdmins,
    uploadResults,
    sendResults,
    addCollege,
    loginAdmin
} = require('../controllers/admin.controller');
const adminAuth = require('../middlewares/admin.middleware');

// Register a new admin
router.post('/register', adminAuth, registerAdmin);

// Login an admin
router.post("/login", loginAdmin)
// Approve a new admin
router.put('/approve/:adminId', adminAuth, approveAdmin);

// Route to get colleges and cities
router.get('/colleges-cities', adminAuth, getCollegesAndCities);

// Declare results
router.post('/declare-results', adminAuth, declareResults);

// Set exam date
router.post('/set-exam-date', adminAuth, setExamDate);

// Get exam schedule
router.get('/exam-schedule', adminAuth, getExamSchedule);

// Allocate seat numbers for students
router.post('/allocate-seats', adminAuth, allocateSeats);

// View registered students with seat numbers
router.get('/view-students', adminAuth, viewStudents);

// View registered admins
router.get('/view-admins', adminAuth, viewAdmins);

// Upload student results via Excel file
router.post('/upload-results', adminAuth, uploadResults);

// Send result emails to students
// router.post('/send-results', adminAuth, sendResults);

// Add a new college
router.post('/add-college', adminAuth, addCollege);

router.get("/get-college", adminAuth, getCollegesAndCities);

module.exports = router;
