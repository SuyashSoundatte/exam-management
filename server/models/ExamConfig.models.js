const mongoose = require('mongoose');

const examConfigSchema = new mongoose.Schema({
    examTitle: { 
      type: String, 
      required: true 
    },
    examDate: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String 
    },
    lastUpdate: { 
      type: Date, 
      default: Date.now() 
    },
}, {timestamps: true});

const ExamConfig = mongoose.model('ExamConfig', examConfigSchema);
module.exports = ExamConfig;
