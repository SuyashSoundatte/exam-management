const Student = require("../models/Student.models");
const { allocateSeats } = require("../config/seatAllocator");

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
          "Student with the same identity (name, date of birth, and school, email) is already registered.",
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

    res.status(201).json({
      message: "Student registered successfully for the exam",
      student: newStudent,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};
const viewResult = async (req, res) => {
  const { seatNumber, dob } = req.body; // Expecting email and dob in the request body

  try {
    // Find the student by email and dob
    const student = await Student.findOne({ seatNumber, dateOfBirth:dob });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Return the student's result
    res.status(200).json({
      message: "Result retrieved successfully",
      result: student.result, // Assuming the result field exists in the Student model
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving result",
      error: error.message,
    });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json({ students });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

const updateStudentMarks = async (req, res) => {
  const { marks } = req.body; // marks is an object with studentId as the key and the marks as the value

  try {
    const updatePromises = Object.keys(marks).map((studentId) => {
      return Student.findByIdAndUpdate(studentId, { result: marks[studentId] });
    });

    await Promise.all(updatePromises);

    return res.status(200).json({ message: "Marks updated successfully!" });
  } catch (error) {
    console.error("Error updating marks:", error);
    return res.status(500).json({ message: "Error updating marks" });
  }
};


module.exports = { registerStudent, viewResult, getAllStudents, updateStudentMarks };
