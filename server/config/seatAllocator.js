// utils/seatAllocator.js
const students = require('../models/Student.models');

const allocateSeats = async (students) => {
    for (let i = 0; i < students.length; i++) {
        students[i].seatNumber = i + 1;
        await students[i].save();
    }
};

module.exports = { allocateSeats };
