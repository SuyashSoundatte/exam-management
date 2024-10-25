const Student = require('../models/Student.models');

const allocateSeats = async (students) => {
    if (!Array.isArray(students) || students.length === 0) {
        throw new Error("Invalid input: students must be a non-empty array");
    }

    const currentYear = new Date().getFullYear();
    const yearSuffix = currentYear.toString().slice(-2);

    const totalStudents = await Student.countDocuments();

    for (let i = 0; i < students.length; i++) {
        const seatNumber = totalStudents + i;
        students[i].seatNumber = `${yearSuffix}exam${seatNumber.toString()}`;
        await students[i].save();
    }
};

module.exports = { allocateSeats };
