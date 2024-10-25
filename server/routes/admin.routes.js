const express = require('express');
const router = express.Router();
const { 
  addCollege, 
  addCity, 
  registerAdmin, 
  loginAdmin, 
  getAllAdmins, 
  deleteAdmin, 
  approveAdmin, 
  updateExamConfig ,
  getExamConfig,
  getAnnouncements,
  createAnnouncement,
  approveSuperAdmin
} = require('../controllers/admin.controller');

const { 
  collegeAuth, 
  cityAuth, 
  registerValidation, 
  adminAuth, 
  authenticateSuperAdmin,
  loginValidation
} = require('../middlewares/admin.middleware');

// College and City Routes
router.post('/addCollege', adminAuth, collegeAuth, addCollege);
router.post("/addCity", adminAuth, cityAuth, addCity);

// Admin Registration and Login
router.post("/register", registerValidation, registerAdmin);
router.post("/login", loginValidation, loginAdmin);

// Get All Admins (only accessible to super admin)
router.get('/allAdmins', authenticateSuperAdmin, getAllAdmins);

// Approve or Disapprove Admin (super admin only)
router.patch('/approve/:adminId', authenticateSuperAdmin, approveAdmin);

router.patch('/approveSuperAdmin/:adminId', authenticateSuperAdmin, approveSuperAdmin);

// Delete Admin (super admin only)
router.delete('/delete/:adminId', authenticateSuperAdmin, deleteAdmin);

// Exam Config routes
router.put('/examConfig', authenticateSuperAdmin, updateExamConfig);
router.get('/examConfig', adminAuth, getExamConfig);

// Announcement routes
router.post('/announcements', authenticateSuperAdmin, createAnnouncement);
router.get('/announcements', adminAuth, getAnnouncements);

module.exports = router;