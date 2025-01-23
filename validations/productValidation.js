const Joi = require('joi');

// Add Product Validation Schema
const addProductSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Product name is required',
  }),
  price: Joi.number().positive().required().messages({
    'number.base': 'Price must be a number',
    'number.positive': 'Price must be a positive number',
    'any.required': 'Price is required',
  }),
  description: Joi.string().optional(),
});

module.exports = {
  addProductSchema,
};