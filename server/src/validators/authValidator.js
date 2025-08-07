const Joi = require("joi");

// Custom phone number validation - must be digits only, 10-15 characters
const phoneSchema = Joi.string()
  .pattern(/^[0-9]{10,15}$/)
  .required()
  .messages({
    "string.pattern.base":
      "Phone number must contain only digits and be 10-15 characters long",
    "string.empty": "Phone number is required",
  });

// Enhanced email validation with specific format requirements
const emailSchema = Joi.string()
  .email({ tlds: { allow: false } }) // More permissive TLD validation
  .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
  .required()
  .messages({
    "string.email":
      "Email must be in format xyz@xyz.xyz (example: user@domain.com)",
    "string.pattern.base":
      "Email must be in format xyz@xyz.xyz (example: user@domain.com)",
    "string.empty": "Email address is required",
  });

exports.customerRegister = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name cannot exceed 50 characters",
    "string.empty": "Name is required",
  }),
  phone: phoneSchema,
  email: emailSchema,
  password: Joi.string().min(8).max(100).required().messages({
    "string.min": "Password must be at least 8 characters long",
    "string.max": "Password cannot exceed 100 characters",
    "string.empty": "Password is required",
  }),
  address: Joi.string().min(5).max(200).required().messages({
    "string.min": "Address must be at least 5 characters long",
    "string.max": "Address cannot exceed 200 characters",
    "string.empty": "Address is required",
  }),
});

exports.customerLogin = Joi.object({
  email: emailSchema,
  password: Joi.string().min(8).max(100).required().messages({
    "string.min": "Password must be at least 8 characters long",
    "string.empty": "Password is required",
  }),
});

exports.employeeRegister = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name cannot exceed 50 characters",
    "string.empty": "Name is required",
  }),
  phone: phoneSchema,
  email: emailSchema,
  password: Joi.string().min(8).max(100).required().messages({
    "string.min": "Password must be at least 8 characters long",
    "string.max": "Password cannot exceed 100 characters",
    "string.empty": "Password is required",
  }),
});

exports.employeeLogin = Joi.object({
  email: emailSchema,
  password: Joi.string().min(8).max(100).required().messages({
    "string.min": "Password must be at least 8 characters long",
    "string.empty": "Password is required",
  }),
});

// Employee profile update (no password required)
exports.employeeProfileUpdate = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name cannot exceed 50 characters",
    "string.empty": "Name is required",
  }),
  phone: phoneSchema,
  email: emailSchema,
});
