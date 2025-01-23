// routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser } = require('../../controllers/authController');
const { authMiddleware } = require('../../middleware/authMiddleware');
const { validateRegistration, validateLogin,validateCreateOrder } = require('../../middleware/validationMiddleware');
const { getProductList, createOrder, getOrderHistory,getUserDetails,getProductDetail,getOrderDetail } = require('../../controllers/userController');

const router = express.Router();

router.post('/auth/register', validateRegistration, registerUser);
router.post('/auth/login', validateLogin, loginUser);

router.get('/user/details', authMiddleware, getUserDetails); // Get user details

// User Routes
router.get('/products', authMiddleware, getProductList); // Show product list
router.get('/products/:id', authMiddleware, getProductDetail); // Get product details by ID

router.post('/orders/create', authMiddleware, validateCreateOrder, createOrder); // Create order
router.get('/orders', authMiddleware, getOrderHistory); // Show order history
router.get('/orders/:id', authMiddleware, getOrderDetail); // Get order details by ID

module.exports = router;