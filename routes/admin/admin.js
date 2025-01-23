// routes/adminRoutes.js
const express = require('express');
const { authMiddleware, adminMiddleware } = require('../../middleware/authMiddleware');
const {
    validateAddProduct,
    validateLogin,
    validateUpdateOrderStatus,
    validateUpdateUser
}=require("../../middleware/validationMiddleware");
const {
  adminLogin,
  adminForgotPassword,
  getDashboardStats,
  getAllUsers,
  updateUser,
  deleteUser,
  getAllOrders,
  updateOrderStatus,
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} = require('../../controllers/adminController');

const router = express.Router();

// Admin Authentication
router.post('/login', validateLogin,adminLogin);
router.post('/forgot-password', adminForgotPassword);

// Admin Dashboard
router.get('/dashboard', authMiddleware, adminMiddleware, getDashboardStats);

// User Management
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);
router.put('/users/:id', authMiddleware, adminMiddleware, validateUpdateUser,updateUser);
router.delete('/users/:id', authMiddleware, adminMiddleware, deleteUser);

// Order Management
router.get('/orders', authMiddleware, adminMiddleware, getAllOrders);
router.put('/orders/:id/status', authMiddleware, adminMiddleware, validateUpdateOrderStatus,updateOrderStatus);

// Product Management Routes
router.get('/products', authMiddleware, adminMiddleware, getAllProducts);
router.post('/products', authMiddleware, adminMiddleware, validateAddProduct, addProduct);
router.put('/products/:id', authMiddleware, adminMiddleware, validateAddProduct, updateProduct);
router.delete('/products/:id', authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;