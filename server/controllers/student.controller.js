const Student = require('../models/Student.models');
const ExamConfig = require('../models/ExamConfig.models');
const { allocateSeats } = require('../config/seatAllocator');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const { jsPDF } = require('jspdf');

const sendEmail = require("../config/sendEmail");

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
            medium,
        } = req.body;

        const existingStudent = await Student.findOne({
            firstName,
            lastName,
            dateOfBirth,
            schoolName,
            email,
        });

        if (existingStudent) {
            return res.status(400).json({
                message:
                    'Student with the same identity (name, date of birth, and school, email) is already registered.',
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

        await allocateSeats([newStudent]);

        await newStudent.save();
        let sub = `Dkte Entrance Exam`
        let text = `${firstName} ${middleName} ${lastName} your registration to exam successfully`

        sendEmail(email, sub, text);

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
    const { seatNumber, dob } = req.body;

    try {
        const student = await Student.findOne({ seatNumber, dateOfBirth: dob });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({
            message: 'Result retrieved successfully',
            result: student.result,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving result',
            error: error.message,
        });
    }
};

const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json({ students });
    } catch (error) {
        console.log('Error: ', error);
        return res.status(500).json({ message: 'Internal server error!' });
    }
};

const updateStudentMarks = async (req, res) => {
    const { marks } = req.body;

    try {
        const updatePromises = Object.keys(marks).map((studentId) => {
            return Student.findByIdAndUpdate(studentId, {
                result: marks[studentId],
            });
        });

        await Promise.all(updatePromises);

        return res.status(200).json({ message: 'Marks updated successfully!' });
    } catch (error) {
        console.error('Error updating marks:', error);
        return res.status(500).json({ message: 'Error updating marks' });
    }
};

const generateHallTicket = async (req, res) => {
    const { seatNumber, dateOfBirth } = req.body;
    const student = await Student.findOne({ seatNumber, dateOfBirth });
    if (!student) {
        res.ok = false;
        return res.status(400).json({
            message: 'invalid student details',
        });
    }
    const exam = await ExamConfig.findOne();
    if (!exam) {
        return res.status(503).json({
            message: 'Exams are not available',
        });
    }
    const studentName = `${student.firstName} ${student.middleName} ${student.lastName}`;
    const { examTitle, examDate } = exam;

    try {
        // const seatNumber = "24exam1";
        // const studentName = "Shreyash Galgale";
        // const examName = "Entrance Examination";
        // const examDate = "05-01-2025";
        const centerName = 'XYZ Examination Center';
        const centerAddress = '123, Main Street, Cityname, State - ZIP';

        const doc = new jsPDF({ orientation: 'landscape' });

        doc.setLineWidth(0.5);
        doc.rect(10, 10, 270, 180);

        doc.setFontSize(24);
        doc.setFont(undefined, 'bold');
        doc.text('Examination Hall Ticket', 140, 30, { align: 'center' });
        doc.setFont(undefined, 'normal');

        doc.setFontSize(12);
        doc.text(`Center: ${centerName}`, 20, 50);
        doc.text(`Address: ${centerAddress}`, 20, 60);

        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Student Details', 20, 80);
        doc.setFont(undefined, 'normal');

        doc.line(20, 82, 260, 82);

        doc.setFontSize(12);
        doc.text('Seat Number:', 40, 95);
        doc.text(seatNumber, 120, 95);

        doc.text('Student Name:', 40, 110);
        doc.setFont(undefined, 'bold');
        doc.text(studentName, 120, 110);
        doc.setFont(undefined, 'normal');

        doc.text('Exam Name:', 40, 125);
        doc.text(examTitle, 120, 125);

        doc.text('Exam Date:', 40, 140);
        doc.text(examDate, 120, 140);

        doc.setFontSize(10);
        doc.text(
            'Note: Please carry a valid photo ID along with this hall ticket to the examination center.',
            20,
            170,
        );

        const pdfData = doc.output();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=Hall_Ticket_${seatNumber}.pdf`,
        );

        res.send(Buffer.from(pdfData, 'binary'));
    } catch (error) {
        console.error('Error generating hall ticket:', error);
        res.status(500).send('An error occurred');
    }
};

const getHallTicketInfo = async (req, res) => {
    try {
        const { email, dob } = req.body;
        const student = await Student.findOne({email, dateOfBirth: dob });
        if (!student) {
            return res.status(400).json({
                message: 'invalid student details',
            });
        }

        const { seatNumber, firstName, middleName, lastName } = student;
        const testCenter = 'DKTE College';
        const course = 'B.Tech Computer Science';
        const studentName = `${firstName} ${middleName} ${lastName}`;
        const exam = await ExamConfig.findOne();
        const { examTitle, examDate } = exam;
        const examTime = '10:00 AM';
        
        return res.status(200).json({
            seatNumber,
            studentName,
            course,
            testCenter,
            examTitle,
            examDate,
            examTime,
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
};
module.exports = {
    registerStudent,
    viewResult,
    getAllStudents,
    updateStudentMarks,
    generateHallTicket,
    getHallTicketInfo,
};
