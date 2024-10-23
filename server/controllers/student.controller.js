const Student = require('../models/Student.models');

const registerStudent = async (req, res) => {
    try {
        const { 
            firstName, 
            middleName, 
            lastName, 
            gender, 
            dateOfBirth, 
            address, 
            cityOrVillage, 
            mobileNumber, 
            whatsappNumber,
            email,
            schoolName, 
            board, 
            medium 
        } = req.body;

        const existingStudent = await Student.findOne({
            firstName,
            lastName,
            dateOfBirth,
            schoolName,
            email
        });

        if (existingStudent) {
            return res.status(400).json({
                message: 'Student with the same identity (name, date of birth, and school, email) is already registered.',
            });
        }

        const newStudent = new Student({
            firstName,
            middleName,
            lastName,
            gender,
            dateOfBirth,
            address,
            cityOrVillage,
            mobileNumber,
            whatsappNumber,
            email,
            schoolName,
            board,
            medium,
        });

        await newStudent.save();

        res.status(201).json({
            message: 'Student registered successfully for the exam',
            student: newStudent,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error. Please try again later.',
            error: error.message,
        });
    }
};


const viewResult = async (req, res) => {
    const { email, dob } = req.body; // Expecting email and dob in the request body

    try {
        // Find the student by email and dob
        const student = await Student.findOne({ email, dateOfBirth: dob });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Return the student's result
        res.status(200).json({
            message: 'Result retrieved successfully',
            result: student.result, // Assuming the result field exists in the Student model
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving result',
            error: error.message,
        });
    }
};

module.exports = { registerStudent, viewResult };
