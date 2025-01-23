const Joi = require('joi');

// Create Order Validation Schema
const createOrderSchema = Joi.object({
  products: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required().messages({
          'string.empty': 'Product ID is required',
        }),
        quantity: Joi.number().integer().min(1).required().messages({
          'number.base': 'Quantity must be a number',
          'number.min': 'Quantity must be at least 1',
          'any.required': 'Quantity is required',
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one product is required',
      'any.required': 'Products are required',
    }),
});

// Update Order Status Validation Schema
const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')
    .required()
    .messages({
      'any.only': 'Invalid status',
      'any.required': 'Status is required',
    }),
});

module.exports = {
  createOrderSchema,
  updateOrderStatusSchema,
};