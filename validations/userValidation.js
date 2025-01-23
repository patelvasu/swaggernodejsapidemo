const Joi = require('joi');

// Update User Validation Schema
const updateUserSchema = Joi.object({
  email: Joi.string().email().optional().messages({
    'string.email': 'Please provide a valid email address',
  }),
  password: Joi.string().min(6).optional().messages({
    'string.min': 'Password must be at least 6 characters long',
  }),
});

module.exports = {
  updateUserSchema,
};