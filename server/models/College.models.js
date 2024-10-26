const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
    collegeName: {
        type: String,
        required: true
    },
}, { timestamps: true });

const College = mongoose.model('College', collegeSchema);
module.exports = College;
