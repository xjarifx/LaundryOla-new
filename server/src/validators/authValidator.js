const Joi = require("joi");

exports.customerRegister = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  phone: Joi.string().min(10).max(15).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(100).required(),
  address: Joi.string().min(5).max(100).required(),
});

exports.customerLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(100).required(),
});

exports.employeeRegister = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  phone: Joi.string().min(10).max(15).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(100).required(),
});

exports.employeeLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(100).required(),
});
