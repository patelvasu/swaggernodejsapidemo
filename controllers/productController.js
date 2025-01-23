// Create a New Product
const Product=require("../models/Product");
const createProduct = async (req, res) => {
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

// List Products with Pagination and Search
const listProducts = async (req, res) => {
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
        return res.status(500).send({
            status: 'error',
            statusCode: 500,
            message: 'Something went wrong. Please try again'
        });
    }
};