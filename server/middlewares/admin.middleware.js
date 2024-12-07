const Admin = require("../models/Admin.models");
const College = require("../models/College.models");
const City = require("../models/City.models");

const Joi = require("joi");
const jwt = require("jsonwebtoken");

const adminAuth = async (req, res, next) => {
  const token = req.cookies.token; 
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SEC);
    const admin = await Admin.findById(decoded.id);
    if (!admin || !admin.isApproved) {
      return res.status(403).json({ message: "You do not have admin access" });
    }

    next();
  } catch (error) {
    res.status(500).json({
      message: "Server error during authentication",
      error: error.message,
    });     
    
  }
};

const collegeSchema = Joi.object({
  collegeName: Joi.string().required(),
});

const collegeAuth = async (req, res, next) => {
  try {
    const { error } = collegeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const { collegeName } = req.body;

    const college = await College.findOne({
      collegeName: collegeName
    });

    if (college) {
      return res.status(400).json({
        message: `College ${college.collegeName} already exists`,
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      message: "Server error during authentication",
      error: error.message,
    });
  }
};




const citySchema = Joi.object({
  cityName: Joi.string().required(),
});

const cityAuth = async (req, res, next) => {
  try {
    const { error } = citySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    // Normalize the city name to lowercase before checking
    const inputCityName = req.body.cityName.toLowerCase();

    // Find the city using case-insensitive search
    /*
    Case-insensitive search using RegExp: This allows MongoDB to search for the city name regardless of case or slight variations in spelling.
    */
    const city = await City.findOne({ cityName: new RegExp(`^${inputCityName}$`, 'i') });
    
    if (city) {
      return res.status(400).json({
        message: "City already exists",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      message: "Server error during authentication",
      error: error.message,
    });
  }
};


const adminSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const registerValidation = (req, res, next) => {
  const { error } = adminSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  next();
};

const loginValidation = (req, res, next) => {
  const { email, password } = req.body;

  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate({ email, password });

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  next();
};
const authenticateSuperAdmin = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SEC);

    const admin = await Admin.findById(decoded.id);


    if (!admin || !admin.isSuperAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    req.user = admin;
    next(); 
  } catch (error) {
    res.status(401).json({
      message: "Unauthorized",
      error: error.message,
    });
  }
};

// ExamConfig validation schema
const examConfigSchema = Joi.object({
    examTitle: Joi.string().required(),
    examDate: Joi.date().required(),
    description: Joi.string().optional(),
});

// Announcement validation schema
const announcementSchema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    examDate: Joi.date().required(),
});

const validateExamConfig = (req, res, next) => {
    const { error } = examConfigSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const validateAnnouncement = (req, res, next) => {
  const { error } = announcementSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = {
  adminAuth,
  cityAuth,
  collegeAuth,
  registerValidation,
  authenticateSuperAdmin,
  validateAnnouncement,
  validateExamConfig,
  loginValidation
};
