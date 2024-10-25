const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  examDate: { 
    type: String, 
    required: true 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Admin" 
  },
  createdAt: { 
    type: Date, 
    default: Date.now()
  },
}, {timestamps: true});

const Announcement = mongoose.model("Announcement", announcementSchema);
module.exports = Announcement;
