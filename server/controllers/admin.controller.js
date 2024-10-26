const College = require('../models/College.models');
const City = require('../models/City.models');
const Admin = require('../models/Admin.models');
const ExamConfig = require('../models/ExamConfig.models');
const Announcement = require('../models/Announcement.models');
const Student = require('../models/Student.models');

const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const addCollege = async(req, res) => {
  try {
    const { collegeName } = req.body;

    // Check if collegeName is provided and is not empty
    if (!collegeName) {
      return res.status(400).json({ message: "College name is required" });
    }

    // Check if a college with the same name already exists
    const existingCollege = await College.findOne({ collegeName: collegeName });
    if (existingCollege) {
      return res.status(400).json({ message: "College already exists" });
    }

    // Create a new college
    const college = new College({
      collegeName: collegeName,
    });

    await college.save(); // Save the new college to the database
    return res.status(201).json({ message: "College added successfully!" });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

const getAllColleges= async (req, res)=>{
  try {
    const schools = await College.find({});
    return res.status(200).json({schools});
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
}

const getAllCities= async (req, res)=>{
  try {
    const cities = await City.find({});
    return res.status(200).json(cities);
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
}

const addCity = async (req, res)=>{
  try {
    const { cityName } = req.body;
    const city = new City({
      cityName: cityName,
    });
    await city.save();
    return res.status(201).json({ message: "City added successfully!" });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
}

const registerAdmin = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingAdmin = await Admin.findOne({ email });

        if (existingAdmin) {
            return res.status(400).json({
                message: 'Admin with the same email already exists.',
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newAdmin = new Admin({
            username,
            email,
            password :hashPassword
        });

        await newAdmin.save();

        res.status(201).json({
            message: 'Admin registered successfully, approvel pending by super admin',
            admin: newAdmin,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error. Please try again later.',
            error: error.message,
        });
    }
};

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
      const admin = await Admin.findOne({ email });

      if (!admin) {
          return res.status(401).json({ message: 'Invalid credentials' });
      }

      if (!admin.isApproved) {
          return res.status(403).json({ message: 'Admin account is not approved yet.' });
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
          return res.status(401).json({ message: 'Password is wrong!' });
      }

      const token = jwt.sign({
          id: admin._id,
          email: admin.email,
          isSuperAdmin: admin.isSuperAdmin
      }, process.env.JWT_SEC, { expiresIn: '24h' });

      res.cookie('token', token, {
          httpOnly: true, // Prevent client-side access to the cookie
          secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
          maxAge: 24 * 60 * 60 * 1000
      });

      req.session.adminId = admin._id; // Store admin ID in session

      res.status(200).json({
          message: 'Login successful',
          admin: {
              username: admin.username,
              isSuperAdmin: admin.isSuperAdmin,
              isApproved: admin.isApproved
          },
          token: token
      });
  } catch (error) {
      res.status(500).json({ message: 'Server error. Please try again later.', error: error.message });
  }
};

const approveAdmin = async (req, res) => {
  const { adminId } = req.params;
  const { approved } = req.body; // Expecting { approved: true/false, y/n, yes/no, Yes/No, YES/NO} const

  try {
      const adminToApprove = await Admin.findById(adminId);
      if (!adminToApprove) {
          return res.status(404).json({ message: 'Admin not found.' });
      }

      // Normalize the approved input
      const normalizedApproval = String(approved).trim().toLowerCase();

      // Determine approval status based on normalized input
      if (normalizedApproval === 'true' || normalizedApproval === 'yes' || normalizedApproval === 'y') {
          adminToApprove.isApproved = true;
      } else if (normalizedApproval === 'false' || normalizedApproval === 'no' || normalizedApproval === 'n') {
          adminToApprove.isApproved = false;
      } else {
          return res.status(400).json({ message: 'Invalid approval status. Please provide true/false or yes/no.' });
      }

      await adminToApprove.save();

      res.status(200).json({ message: `Admin ${adminToApprove.isApproved ? 'approved' : 'disapproved'} successfully.`, admin: adminToApprove });
  } catch (error) {
      res.status(500).json({ message: 'Error updating admin status.', error: error.message });
  }
};

const approveSuperAdmin = async (req, res) => {
  const { adminId } = req.params;
  const { superAdminApproval } = req.body;

  try {
      const adminToApprove = await Admin.findById(adminId);
      if (!adminToApprove) {
          return res.status(404).json({ message: 'Admin not found.' });
      }

      // Normalize the superAdminApproval input
      const normalizedSuperAdminApproval = String(superAdminApproval).trim().toLowerCase();

      // Determine superadmin approval status based on normalized input
      if (normalizedSuperAdminApproval === 'true' || normalizedSuperAdminApproval === 'yes' || normalizedSuperAdminApproval === 'y') {
          adminToApprove.isSuperAdmin = true;
      } else if (normalizedSuperAdminApproval === 'false' || normalizedSuperAdminApproval === 'no' || normalizedSuperAdminApproval === 'n') {
          adminToApprove.isSuperAdmin = false;
      } else {
          return res.status(400).json({ message: 'Invalid superadmin approval status. Please provide true/false or yes/no.' });
      }

      await adminToApprove.save();

      res.status(200).json({
          message: `Superadmin ${adminToApprove.isSuperAdminApproved ? 'approved' : 'disapproved'} successfully.`,
          admin: adminToApprove
      });
  } catch (error) {
      res.status(500).json({ message: 'Error updating superadmin status.', error: error.message });
  }
};


const getAllAdmins = async (req, res) => {
  try {
      const admins = await Admin.find({});
      res.status(200).json(admins);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching admins.', error: error.message });
  }
};

const deleteAdmin = async (req, res) => {
  const { adminId } = req.params;

  try {
      const adminToDelete = await Admin.findById(adminId);
      if (!adminToDelete) {
          return res.status(404).json({ message: 'Admin not found.' });
      }

      await Admin.deleteOne({ _id: adminId });

      res.status(200).json({ message: 'Admin deleted successfully.', admin: adminToDelete });
  } catch (error) {
      res.status(500).json({ message: 'Error deleting admin.', error: error.message });
  }
};

const updateExamConfig = async (req, res) => {
  try {
    const { examTitle, examDate, description } = req.body;

    const updatedConfig = await ExamConfig.findOneAndUpdate(
      {},
      { examTitle, examDate, description, lastUpdate: Date.now() },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: 'Exam configuration updated successfully.', config: updatedConfig });
  } catch (error) {
    res.status(500).json({ message: 'Error updating exam configuration.', error: error.message });
  }
};

// Get Exam Config
const getExamConfig = async (req, res) => {
  try {
    const config = await ExamConfig.findOne({});
    res.status(200).json(config);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving exam configuration.', error: error.message });
  }
};

// Create Announcement
const createAnnouncement = async (req, res) => {
  try {
    const { title, content, examDate } = req.body;

    const announcement = new Announcement({
      title,
      content,
      examDate,
      createdBy: req.user.id
    });

    await announcement.save();
    res.status(201).json({ message: 'Announcement created successfully', announcement });
  } catch (error) {
    res.status(500).json({ message: 'Error creating announcement.', error: error.message });
  }
};

// Get Announcements
const getAnnouncements = async (req, res) => {
  try {
    // Fetch all announcements
    const announcements = await Announcement.find({});
    
    // Fetch all registered students
    const students = await Student.find({}); // Assuming you have a Student model

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_PASS, // Your Gmail password or app-specific password
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.GMAIL_USER, // Sender address
      subject: 'New Announcements',
      text: `Dear Students,\n\nHere are the new announcements:\n\n${announcements.map(announcement => announcement.title).join('\n')}\n\nBest regards,\nYour Team`, // Customize the message as needed
    };

    // Send email to each student
    for (const student of students) {
      mailOptions.to = student.email; // Assuming each student has an email field
      await transporter.sendMail(mailOptions);
    }

    // Send announcements back to the response
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving announcements.', error: error.message });
  }
};


module.exports = {
  addCollege,
  addCity,
  registerAdmin,
  loginAdmin,
  approveAdmin,
  getAllAdmins,
  deleteAdmin,
  updateExamConfig,
  getExamConfig,
  createAnnouncement,
  getAllCities,
  getAllColleges,
  getAnnouncements,
  approveSuperAdmin
}