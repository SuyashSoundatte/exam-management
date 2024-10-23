const Admin = require('../models/Admin.models');

const adminAuth = async (req, res, next) => {
    try {
        const admin = await Admin.findById(req.adminId);

        if (!admin || !admin.isApproved) {
            return res.status(403).json({ message: 'You do not have admin access' });
        }

        // Ensure super admin has not deactivated this admin account
        if (!admin.isActive) {
            return res.status(403).json({ message: 'Your admin account is deactivated. Please contact Super Admin.' });
        }

        // (Optional) Check if session has expired (if session management implemented)
        const sessionExpiry = admin.sessionExpiry; // Assuming there's a sessionExpiry field in Admin model
        if (sessionExpiry && new Date() > sessionExpiry) {
            return res.status(403).json({ message: 'Session has expired. Please log in again.' });
        }

        next();
    } catch (error) {
        res.status(500).json({
            message: 'Server error during authentication',
            error: error.message,
        });
    }
};

module.exports = adminAuth;
