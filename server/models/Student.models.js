const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    middleName: {
        type: String,
    },
    lastName: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
        match:/^\d{4}-\d{2}-\d{2}$/,
    },
    address: {
        type: String,
        required: true,
    },
    cityOrVillage: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required: true,
        match: /^\d{10}$/
    },
    whatsappNumber: {
        type: String,
        required: true,
        match: /^\d{10}$/
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    schoolName: {
        type: String,
        required: true,
    },
    board: {
        type: String,
        enum: ['SSC', 'CBSE', 'ICSE', 'OLYMPIAD'],
        required: true,
    },
    medium: {
        type: String,
        enum:['Marathi', 'Semi-English', 'English'],
        required: true,
    },
    seatNumber:{
        type: String,
        unique: true 
    },
    result:{ 
        type: String, 
        default: null 
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
