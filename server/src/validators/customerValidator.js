const Joi = require("joi");

exports.register = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  phone: Joi.string().min(10).max(15).required(),
  address: Joi.string().min(5).max(100).required(),
});

exports.addMoney = Joi.object({
  amount: Joi.number().min(1).required(),
});
