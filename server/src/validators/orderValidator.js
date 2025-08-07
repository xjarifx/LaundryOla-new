const Joi = require("joi");

exports.create = Joi.object({
  service_id: Joi.number().integer().required(),
  quantity: Joi.number().integer().min(1).required(),
});
