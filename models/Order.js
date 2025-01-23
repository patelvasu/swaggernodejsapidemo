// models/Order.js
const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
    orderId: { type: String, required: true,unique: true },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true },
    products: [
        { 
            productId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Product'
            }, 
            quantity: Number 
        }],
    status: { type: String, enum:["Pending","Processing","Shipped","Delivered"], default: 'Pending' }
});

OrderSchema.pre("save", function (next) {
    const order = this;
    order.orderId = "ORD-" + Math.floor(Math.random() * 1000000);
    next();
});


module.exports = mongoose.model('Order', OrderSchema);