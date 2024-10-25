const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    city:{
        type:String,
        required:true
    }
}, { timestamps: true });

const College = mongoose.model('College', collegeSchema);
module.exports = College;
