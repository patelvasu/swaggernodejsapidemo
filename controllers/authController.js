const jwt = require('jsonwebtoken');
const User = require('../models/User');

const registerUser = async (req, res) => {
    const { email, password, termsAccepted } = req.body;
    try {
        let isExit = await User.countDocuments({ email });
        if (isExit>0) return res.status(400).json({
            status: 'error',
            statusCode: 400,
            message: 'User already exists'
        });

        let user =await User.create({ email, password, termsAccepted });
        if(!user){
            return res.status(400).json({ 
                status: 'error',
                statusCode: 400,
                message: 'User registeration failed'
             });
        }
        return res.send({
            status: 'success',
            statusCode: 201,
            message: 'User registered successfully'
        })
    } catch (err) {
        return res.status(500).send({
            status: 'error',
            statusCode: 500,
            message: 'Something went wrong. Please try again'
        });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ 
            status: 'error',
            statusCode: 400,
            message: 'Invalid Credentials'
        });
    
        const isMatch = await user.validatePassword(password);
        if (!isMatch) return res.status(400).json({ 
            status: 'error',
            statusCode: 400,
            message: 'Invalid Credentials'
        });

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
        console.log(err);
        
       return res.status(500).send({
            status: 'error',
            statusCode: 500,
            message: 'Something went wrong. Please try again'
        });
    }
};

module.exports = { registerUser, loginUser };