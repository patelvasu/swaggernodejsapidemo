// controllers/userController.js
const Product = require('../models/Product');
const Order = require('../models/Order');
const User=require('../models/User');


// Get User Details
const getUserDetails = async (req, res) => {
    const userId = req.user.id;
    try {
      const user = await User.findById(userId).select('-password'); // Exclude password
      if (!user) {
        return res.status(404).json({
          status: 'error',
          statusCode: 404,
          message: 'User not found'
        });
      }
      res.json({
        status: 'success',
        statusCode: 200,
        message: 'User details fetched successfully',
        data: {
            user
        }
      });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Something went wrong. Please try again',
           });
    }
  };

// Show Product List
const getProductList = async (req, res) => {
    const { page = 1, limit = 10, search = '' } = req.query;
    try {
      const query = {};
      if (search) {
        query.name = { $regex: search, $options: 'i' }; // Case-insensitive search
      }
  
      const products = await Product.find(query)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
  
      const count = await Product.countDocuments(query);
  
      res.json({
        status: 'success',
        statusCode: 200,
        message: 'Products fetched successfully',
        data: {
            products,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        },
      });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: 'Something went wrong. Please try again',
       });
    }
};

// Create Order
const createOrder = async (req, res) => {
  const { products } = req.body;
  const userId = req.user.id; // Extracted from JWT token

  try {
    // Validate products
    const productIds = products.map((item) => item.productId);
    const validProducts = await Product.find({ _id: { $in: productIds } });

    if (validProducts.length !== products.length) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Invalid product IDs',
      });
    }

    // Calculate total price
    let totalPrice = 0;
    const orderProducts = products.map((item) => {
      const product = validProducts.find((p) => p._id.toString() === item.productId);
      totalPrice += product.price * item.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
      };
    });

    // Create order
    const order = new Order({
      userId,
      products: orderProducts,
      totalPrice,
      status: 'Pending',
    });

    await order.save();
    res.status(201).json({
        status: 'success',
        statusCode: 201,
        message: 'Order created successfully',
        data: {
            order
        }
    });
  } catch (err) {
    res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: 'Something went wrong. Please try again',
       });
  }
};

// Show Order History
const getOrderHistory = async (req, res) => {
    const userId = req.user.id; // Extracted from JWT token
    const { search,status, page = 1, limit = 10 } = req.query;
  
    try {
      const query = { userId };
      if (status) {
        query.status = status;
      }
      if (search) {
        query.orderId = { $regex: search, $options: 'i' }; // Case-insensitive search
      }
  
      const orders = await Order.find(query)
        .populate('products.productId', 'name price')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 }); // Sort by most recent orders
  
      const count = await Order.countDocuments(query);
  
      res.json({
        status: 'success',
        statusCode: 200,
        message: 'Order history fetched successfully',
        data: {
            orders,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        },
      });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Something went wrong. Please try again',
           });
    }
};

// Get Product Details by ID
const getProductDetail = async (req, res) => {
    const { id } = req.params;
    try {
      const product = await Product.findById(id);
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
        message: 'Product details fetched successfully',
        data: {
          product,
        },
      });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Something went wrong. Please try again',
           });
    }
  };
  
  // Get Order Details by ID
  const getOrderDetail = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; // Extracted from JWT token
  
    try {
      const order = await Order.findOne({ _id: id, userId }).populate(
        'products.productId',
        'name price'
      );
      if (!order) {
        return res.status(404).json({
          status: 'error',
          statusCode: 404,
          message: 'Order not found',
        });
      }
      res.json({
        status: 'success',
        statusCode: 200,
        message: 'Order details fetched successfully',
        data: {
          order,
        },
      });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Something went wrong. Please try again',
        });
    }
  };

module.exports = {
    getUserDetails,
    getProductList,
    createOrder,
    getOrderHistory,
    getProductDetail,
    getOrderDetail
};