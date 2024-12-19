const College = require('../models/College.models');
const City = require('../models/City.models');
const Admin = require('../models/Admin.models');
const ExamConfig = require('../models/ExamConfig.models');
const Announcement = require('../models/Announcement.models');
const Student = require('../models/Student.models');

const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');

const addCollege = async(req, res) => {
  try {
    const { collegeName } = req.body;

    if (!collegeName) {
      return res.status(400).json({ message: "College name is required" });
    }


    const existingCollege = await College.findOne({ collegeName: collegeName });
    if (existingCollege) {
      return res.status(400).json({ message: "College already exists" });
    }

    const college = new College({
      collegeName: collegeName,
    });

    await college.save();
    return res.status(201).json({ message: "College added successfully!" });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

const getAllColleges= async (req, res)=>{
  const { query } = req.query;
  try {
    let searchFilter = {};

    if (query) {
      const normalizedQuery = query.replace(/\./g, "").toLowerCase(); // Remove dots & lowercase
      searchFilter = {
        collegeName: { $regex: normalizedQuery, $options: "i" }, // Case-insensitive regex search
      };
    }

    // Fetch schools based on the search filter
    const schools = await College.find(searchFilter).limit(50); // Limit results to 50
    return res.status(200).json({ schools });
  } catch (error) {
    console.error("Error fetching schools:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

const getAllCities= async (req, res)=>{
  const { query } = req.query;

  try {
    let searchFilter = {};

    if (query) {
      const normalizedQuery = query.replace(/\./g, "").toLowerCase();
      searchFilter = {
        cityName: { $regex: normalizedQuery, $options: "i" },
      };
    }

    const cities = await City.find(searchFilter).limit(50);
    return res.status(200).json({ cities }); // Return 'cities' as an array
  } catch (error) {
    console.error("Error fetching cities:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

const addCity = async (req, res)=>{
  const { cityName } = req.body;

  try {
    const existingCity = await City.findOne({ cityName: { $regex: new RegExp(`^${cityName}$`, 'i') } });

    if (existingCity) {
      return res.status(400).json({ message: "City already exists" });
    }

    const newCity = new City({ cityName });
    await newCity.save();

    return res.status(201).json({ message: "City added successfully", city: newCity });
  } catch (error) {
    console.error("Error adding city:", error);
    return res.status(500).json({ message: "Internal Server Error" });
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

        let sub = `Exam-Management access approval`
        let text = `${username} you approval from superadmin confirmed! this is your email: ${email} password: ${password}`

        sendEmail(email, sub, text);

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
  const { username,approval } = req.body;

  try {
      const adminToApprove = await Admin.findOne({username});
      if (!adminToApprove) {
          return res.status(404).json({ message: 'Admin not found.' });
      }

      const normalizedApproval = String(approval).trim().toLowerCase();

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
  const { username, superAdminApproval } = req.body;

  try {
      const adminToApprove = await Admin.findOne({username});
      if (!adminToApprove) {
          return res.status(404).json({ message: 'Admin not found.' });
      }

      const normalizedSuperAdminApproval = String(superAdminApproval).trim().toLowerCase();

      if (normalizedSuperAdminApproval === 'true' || normalizedSuperAdminApproval === 'yes' || normalizedSuperAdminApproval === 'y') {
          adminToApprove.isSuperAdmin = true;
      } else if (normalizedSuperAdminApproval === 'false' || normalizedSuperAdminApproval === 'no' || normalizedSuperAdminApproval === 'n') {
          adminToApprove.isSuperAdmin = false;
      } else {
          return res.status(400).json({ message: 'Invalid superadmin approval status. Please provide true/false or yes/no.' });
      }

      await adminToApprove.save();

      res.status(200).json({
        message: `Superadmin ${adminToApprove.isSuperAdmin ? 'approved' : 'disapproved'} successfully.`,
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
  const { username } = req.body;

  try {
      const adminToDelete = await Admin.findOne({username});
      if (!adminToDelete) {
          return res.status(404).json({ message: 'Admin not found.' });
      }

      await Admin.deleteOne({username});

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


const getExamConfig = async (req, res) => {
  try {
    const config = await ExamConfig.find({});
    res.status(200).json(config);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving exam configuration.', error: error.message });
  }
};


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

const getDataByYear = async (req, res)=>{
  const { year } = req.body;
  if (!year || isNaN(year)) {
    return res.status(400).json({ message: 'Invalid or missing year' });
  }

  try {
    const students = await Student.find({
      createdAt: {
        $gte: new Date(`${year}-01-01T00:00:00.000Z`),
        $lt: new Date(`${year}-12-31T23:59:59.999Z`),
      },
    });

    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 

const createExam = async (req, res) => {
  try {
    const { examTitle, examDate, examTime, description } = req.body;

    if (!examTitle || !examDate || !examTime) {
      return res.status(400).json({ message: 'Exam Title, Exam Date, and Exam Time are required.' });
    }
    const newExamConfig = new ExamConfig({
      examTitle,
      examDate,
      examTime,
      description: description || '', 
    });

    await newExamConfig.save();

    res.status(201).json({
      message: 'Exam created successfully!',
      config: newExamConfig,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating exam. Please try again later.' });
  }
};


const updateStudentMarks = (req, res)=>{
  const { studentId, result } = req.body;

  Student.findByIdAndUpdate(studentId, { result }, { new: true })
    .then(updatedStudent => {
      if (!updatedStudent) {
        return res.status(404).json({ message: 'Student not found' });
      }
      res.json(updatedStudent);
    })
    .catch(error => {
      console.error('Error updating student marks:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
}


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
  approveSuperAdmin,
  getDataByYear,
  createExam,
  updateStudentMarks
}