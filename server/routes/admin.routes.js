const express = require("express");
const router = express.Router();
const {exportToExcel} = require("../config/excelConvertor");
const {
    addCollege,
    addCity,
    registerAdmin,
    loginAdmin,
    getAllAdmins,
    deleteAdmin,
    approveAdmin,
    updateExamConfig,
    getExamConfig,
    getAnnouncements,
    createAnnouncement,
    approveSuperAdmin,
    getAllColleges,
    getAllCities,
    getDataByYear,
    getStudentByExamTitle,
    createExam,
    updateStudentMarks
} = require("../controllers/admin.controller");

const {
    collegeAuth,
    cityAuth,
    registerValidation,
    adminAuth,
    authenticateSuperAdmin,
    loginValidation,
    validateUpdateResult
} = require("../middlewares/admin.middleware");

router.get("/verifyToken", adminAuth, (req, res) => {
    res.status(200).json({ isValid: true, message: "Token is valid" });
});
router.post("/addCollege", adminAuth, collegeAuth, addCollege);
router.post("/addCity", adminAuth, cityAuth, addCity);
router.get("/allColleges", getAllColleges);
router.get("/allCities", getAllCities);

router.post("/register", registerValidation, registerAdmin);
router.post("/login", loginValidation, loginAdmin);

router.get("/allAdmins", authenticateSuperAdmin, getAllAdmins);
router.get("/isSuperAdmin", authenticateSuperAdmin, (req, res) => {
    return res.status(200).json({
        isSuperAdmin: true,
    });
});

router.get('/getDataByYear', adminAuth, getDataByYear);
router.get('/getStudentByExamTitle', adminAuth, getStudentByExamTitle);

router.patch("/approve", authenticateSuperAdmin, approveAdmin);

router.patch("/approveSuperAdmin", authenticateSuperAdmin, approveSuperAdmin);

router.delete("/delete", authenticateSuperAdmin, deleteAdmin);

router.put("/examConfig", authenticateSuperAdmin, updateExamConfig);
router.get("/examConfig", adminAuth, getExamConfig);
router.post("/createExam", adminAuth, createExam);

router.post("/announcements", authenticateSuperAdmin, createAnnouncement);
router.get("/announcements", adminAuth, getAnnouncements);


router.post("/submitMarks", adminAuth, validateUpdateResult, updateStudentMarks);

router.get("/exportToExcel", adminAuth, exportToExcel);

module.exports = router;
