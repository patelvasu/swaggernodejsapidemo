// controllers/adminController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
// Admin Login
const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, role: 'admin' });
    if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

    const isMatch = await user.validatePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

    const payload = { user: { id: user.id, role: user.role } };
    let token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    user.token=token;
    await user.save();
    return res.send({
        status: 'success',
        statusCode: 200,
        message: 'User logged in successfully',
        data: {
            id: user.id,
            email: user.email,
            role: user.role,
            balance: user.balance,
            token
        }
    });
  } catch (err) {
    return res.status(500).send({
        status: 'error',
        statusCode: 500,
        message: 'Something went wrong. Please try again'
    });
  }
};

// Admin Forgot Password
const adminForgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email, role: 'admin' });
    if (!user) return res.status(400).json({ message: 'Admin not found' });

    // Send password reset link (implementation depends on your email service)
    res.send({
        status: 'success',
        statusCode: 200,
        message: 'Password reset link sent successfully'
    });
  } catch (err) {
    return res.status(500).send({
        status: 'error',
        statusCode: 500,
        message: 'Something went wrong. Please try again'
    });
  }
};

// Get Dashboard Stats (Total Users, Total Orders)
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalOrders = await Order.countDocuments();
    res.json({
        status: 'success',
        statusCode: 200,
        message: 'Dashboard stats fetched successfully',
        data: {
            totalUsers,
            totalOrders
        }
    });
  } catch (err) {
    return res.status(500).send({
        status: 'error',
        statusCode: 500,
        message: 'Something went wrong. Please try again'
    });
  }
};

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search }=req.query;
    let query = {isDeleted:false,role:'user'};
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }
    const users = await User.find(query).select('-password -token -role -__v').skip((page - 1) * limit).limit(limit);
    res.json({
        status: 'success',
        statusCode: 200,
        message: 'Users fetched successfully',
        data: {
            users
        }
    });
  } catch (err) {
    return res.status(500).send({
        status: 'error',
        statusCode: 500,
        message: 'Something went wrong. Please try again'
    });
  }
};

// Update User
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;
  try {
    let user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (email) user.email = email;
    if (password) {
      user.password = password;
    }
    await user.save();
    res.json({
        status: 'success',
        statusCode: 200,
        message: 'User updated successfully'
    });
  } catch (err) {
    return res.status(500).send({
        status: 'error',
        statusCode: 500,
        message: 'Something went wrong. Please try again'
    });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
        status: 'success',
        statusCode: 200,
        message: 'User deleted successfully'
     });
  } catch (err) {
    return res.status(500).send({
        status: 'error',
        statusCode: 500,
        message: 'Something went wrong. Please try again'
    });
  }
};

// Get All Orders
const getAllOrders = async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  try {
    const query = {};
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('userId', 'email')
      .populate('products.productId', 'name price')
      .skip((page - 1) * limit)
      .limit(limit);

    const totalOrders = await Order.countDocuments(query);
    res.json({
        status: 'success',
        statusCode: 200,
        message: 'Orders fetched successfully',
        data: {
            orders,
            totalOrders
        }
    });
  } catch (err) {
    return res.status(500).send({
        status: 'error',
        statusCode: 500,
        message: 'Something went wrong. Please try again'
    });
  }
};

// Update Order Status
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({
        status: 'success',
        statusCode: 200,
        message: 'Order status updated successfully',
        data: {
            order
        }
    });
  } catch (err) {
    return res.status(500).send({
        status: 'error',
        statusCode: 500,
        message: 'Something went wrong. Please try again'
    });
  }
};
// Get All Products
const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10,search } = req.query;
    let query = {};
    if(search){
        query.name = { $regex: search, $options: 'i' };
    }
    const products = await Product.find(query).skip((page - 1) * limit)
    .limit(limit);
    res.json({
        status: 'success',
        statusCode: 200,
        message: 'Products fetched successfully',
        data: {
            products
        }
    });
  } catch (err) {
    return res.status(500).send({
        status: 'error',
        statusCode: 500,
        message: 'Something went wrong. Please try again'
    });
  }
};

// Add a New Product
const addProduct = async (req, res) => {
  const { name, price, description } = req.body;
  try {
    const product = new Product({ name, price, description });
    await product.save();
    res.status(201).json({
        status: 'success',
        statusCode: 201,
        message: 'Product added successfully',
        data: {
            product
        }
    });
  } catch (err) {
    return res.status(500).send({
        status: 'error',
        statusCode: 500,
        message: 'Something went wrong. Please try again'
    });
  }
};

// Update a Product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description } = req.body;
  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { name, price, description },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({
        status: 'error',
        statusCode: 404,
        message: 'Product not found',
      });
    }
      res.json({
      status: 'success',
      statusCode: 200,
      message: 'Product updated successfully',
      data: {
        product,
      },
    });
  } catch (err) {
    return res.status(500).send({
        status: 'error',
        statusCode: 500,
        message: 'Something went wrong. Please try again'
    });
  }
};

// Delete a Product
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({
        status: 'error',
        statusCode: 404,
        message: 'Product not found',
      });
    }
    res.json({
        status: 'success',
        statusCode: 200,
        message: 'Product deleted successfully'
    });
  } catch (err) {
    return res.status(500).send({
        status: 'error',
        statusCode: 500,
        message: 'Something went wrong. Please try again'
    });
  }
};

module.exports = {
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
};