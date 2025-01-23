const { registerSchema,
     loginSchema, forgotPasswordSchema, resetPasswordSchema } = require('../validations/authValidation');
const { updateUserSchema } = require('../validations/userValidation');
const { addProductSchema } = require('../validations/productValidation');
const { createOrderSchema, updateOrderStatusSchema } = require('../validations/orderValidation');

// Generic Validation Middleware
const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// Export Specific Validation Middleware
module.exports = {
  validateRegistration: validateRequest(registerSchema),
  validateLogin: validateRequest(loginSchema),
  validateForgotPassword: validateRequest(forgotPasswordSchema),
  validateResetPassword: validateRequest(resetPasswordSchema),
  validateUpdateUser: validateRequest(updateUserSchema),
  validateAddProduct: validateRequest(addProductSchema),
  validateUpdateProduct: validateRequest(addProductSchema),
  validateCreateOrder: validateRequest(createOrderSchema),
  validateUpdateOrderStatus: validateRequest(updateOrderStatusSchema),
};