const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9_]{3,30}$/, // Example regex for username validation
    },
    password: {
        type: String,
        required: true,
    },
    isSuperAdmin: {
        type: Boolean,
        default: false,
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
    },
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
