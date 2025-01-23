// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    console.log("token",token);
    
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const tk=token.split(" ")[1];
        const decoded = jwt.verify(tk, process.env.JWT_SECRET_KEY);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
};

module.exports = { authMiddleware, adminMiddleware };