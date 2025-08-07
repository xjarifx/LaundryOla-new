const Joi = require("joi");

exports.create = Joi.object({
  service_name: Joi.string().min(2).max(50).required(),
  price: Joi.number().min(0.01).required(),
});

exports.update = Joi.object({
  service_name: Joi.string().min(2).max(50).required(),
  price: Joi.number().min(0.01).required(),
});
