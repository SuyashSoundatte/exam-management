const Joi = require('joi');

const registerSchema = Joi.object({
    firstName: Joi.string().required(),
    middleName: Joi.string().allow(null, ''), // Optional field
    lastName: Joi.string().required(),
    gender: Joi.string().valid('Male', 'Female', 'Other').required(),
    dateOfBirth: Joi.string().pattern(/^\d{2}-\d{2}-\d{4}$/).required(), // Validates dd-mm-yyyy format
    address: Joi.string().required(),
    cityOrVillage: Joi.string().required(),
    mobileNumber: Joi.string().pattern(/^\d{10}$/).required(), // 10-digit number validation
    whatsappNumber: Joi.string().pattern(/^\d{10}$/).required(), // 10-digit number validation
    email: Joi.string().email().required(),
    schoolName: Joi.string().required(),
    board: Joi.string().valid('SSC', 'CBSE').required(),
    medium: Joi.string().required(),
});

const registerValidation = (req, res, next) => {
    const { error } = registerSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }

    next();
};

module.exports = { registerValidation };
