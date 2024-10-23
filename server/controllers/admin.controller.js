const Admin = require('../models/Admin.models');
const bcrypt = require('bcrypt');
const Student = require('../models/Student.models');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const College = require('../models/College.models');

const { readAdminExcelFile }= require("../config/excelReader");

const registerAdmin = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if username is taken
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Username already taken. Please choose another one.' });
        }

        const adminExists = await Admin.findOne(); // To check if super admin exists
        const hashedPassword = await bcrypt.hash(password, 10);

        if (!adminExists) {
            const newAdmin = new Admin({
                username,
                password: hashedPassword,
                isSuperAdmin: true,
                isApproved: true,
            });
            await newAdmin.save();

            return res.status(201).json({
                message: 'Super Admin registered successfully',
                admin: newAdmin,
            });
        }

        // If super admin exists, register normal admin
        const newAdmin = new Admin({
            username,
            password: hashedPassword,
        });

        await newAdmin.save();

        res.status(201).json({
            message: 'Admin registration successful. Pending approval by Super Admin.',
            admin: newAdmin,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error. Please try again later.',
            error: error.message,
        });
    }
};

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }

        // Find admin by username
        const admin = await Admin.findOne({ email });
        if (!admin || !admin.isApproved) {
            return res.status(403).json({ message: 'Admin not approved or does not exist.' });
        }

        // Compare pasloginAdmin
        // Create JWT token
        const token = jwt.sign({ id: admin._id, email: admin.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

const getCollegesAndCities = async (req, res) => {
    try {
        const colleges = await College.find();
        const cities = [...new Set(colleges.map(college => college.city))]; // Get unique cities

        res.status(200).json({
            colleges,
            cities,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error. Please try again later.',
            error: error.message,
        });
    }
};

const approveAdmin = async (req, res) => {
    try {
        const { approverId } = req.body;

        const approver = await Admin.findById(approverId);
        if (!approver || !approver.isSuperAdmin) {
            return res.status(403).json({ message: 'Only Super Admin can approve admins' });
        }

        const adminData = await readAdminExcelFile(); // Read data from Excel file

        const approvedAdmins = [];
        let approvedCount = 0;
        for (const adminInfo of adminData) {
            const admin = await Admin.findOne({ email: adminInfo.email });
            if (admin && !admin.isApproved) {
                admin.isApproved = true;
                admin.approvedBy = approverId;
                await admin.save();
                approvedAdmins.push(admin);
                approvedCount++;
            }
        }

        res.status(200).json({
            message: `${approvedCount} admins approved successfully`,
            approvedAdmins,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error. Please try again later.',
            error: error.message,
        });
    }
};

const declareResults = async (req, res) => {
    const { results } = req.body; // Expecting results as an array of objects { email, result }

    try {
        const declaredResults = [];
        let successCount = 0;
        let failedCount = 0;

        for (const result of results) {
            const student = await Student.findOne({ email: result.email });

            if (student) {
                student.result = result.result; // Assuming a 'result' field exists in the Student model
                await student.save();
                declaredResults.push(student);
                successCount++;
            } else {
                failedCount++;
            }
        }

        res.status(200).json({
            message: `${successCount} results declared successfully, ${failedCount} students not found`,
            declaredResults,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error declaring results',
            error: error.message,
        });
    }
};

const setExamDate = async (req, res) => {
    try {
        const { examId, date } = req.body; // Extract examId and date from request body

        // Validate input
        if (!examId || !date) {
            return res.status(400).json({ message: 'Exam ID and date are required.' });
        }

        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        exam.date = date;
        await exam.save();

        res.status(200).json({ message: 'Exam date set successfully', exam });
    } catch (error) {
        res.status(500).json({ message: 'Error setting exam date', error });
    }
};

const getExamSchedule = async (req, res) => {
    try {
        const exams = await Exam.find({ date: { $exists: true } }).populate('subject'); // Assuming exams have a date field and can be populated with subjects

        if (!exams || exams.length === 0) {
            return res.status(404).json({ message: 'No exams found in the schedule.' });
        }

        res.status(200).json({ message: 'Exam schedule retrieved successfully', exams });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving exam schedule', error });
    }
};

const allocateSeats = async (req, res) => {
    const { examId } = req.params;
    const { studentIds } = req.body;

    try {
        const exam = await Exam.findById(examId);

        if (!exam) {
            return res.status(404).json({ message: 'Exam not found.' });
        }

        const allocatedSeats = exam.allocatedSeats || [];
        const totalSeats = exam.totalSeats;
        const currentAllocationCount = allocatedSeats.length;

        const remainingSeats = totalSeats - currentAllocationCount;

        if (studentIds.length > remainingSeats) {
            return res.status(400).json({ message: 'Not enough seats available for the requested students.' });
        }

        allocatedSeats.push(...studentIds);

        exam.allocatedSeats = allocatedSeats;
        await exam.save();

        res.status(200).json({
            message: 'Seats allocated successfully.',
            exam: {
                id: exam._id,
                allocatedSeats: exam.allocatedSeats,
                totalSeats: exam.totalSeats,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Error allocating seats', error });
    }
};

const viewStudents = async (req, res) => {
    const { examId } = req.params;

    try {
        const students = await Student.find({ examId }).select('-__v');

        if (students.length === 0) {
            return res.status(404).json({ message: 'No students allocated for this exam.' });
        }

        res.status(200).json({
            message: 'Students retrieved successfully.',
            students,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving students', error });
    }
};

const viewAdmins = async (req, res) => {
    try {
        const admins = await Admin.find().select('-__v'); // Exclude version field

        if (admins.length === 0) {
            return res.status(404).json({ message: 'No admins found.' });
        }

        res.status(200).json({
            message: 'Admins retrieved successfully.',
            admins,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving admins', error });
    }
};

const uploadResults = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        const results = [];
        const filePath = path.join(__dirname, '../uploads', req.file.filename);

        // Parse the CSV file
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                try {
                    await Result.insertMany(results);
                    res.status(200).json({ message: 'Results uploaded successfully.', results });
                } catch (dbError) {
                    res.status(500).json({ message: 'Error saving results to database.', error: dbError });
                } finally {
                    fs.unlinkSync(filePath);
                }
            });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading results', error });
    }
};

const addCollege = async (req, res) => {
    try {
        const { name, city, state, courses } = req.body;

        // Validate input
        if (!name || !city || !state || !courses) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Create a new college document
        const newCollege = new College({
            name,
            city,
            state,
            courses
        });

        // Save to database
        await newCollege.save();

        // Respond with success message and college data
        res.status(201).json({
            message: 'College added successfully.',
            college: newCollege
        });
    } catch (error) {
        console.error('Error adding college:', error);
        res.status(500).json({ message: 'Error adding college', error });
    }
};



module.exports = { 
    addCollege,
    uploadResults,
    viewAdmins,
    viewStudents,
    allocateSeats,
    getExamSchedule, 
    setExamDate, 
    registerAdmin, 
    approveAdmin, 
    getCollegesAndCities, 
    declareResults,
    loginAdmin
};
