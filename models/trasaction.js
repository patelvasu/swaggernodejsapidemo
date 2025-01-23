const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    }
});

TransactionSchema.pre('save', function (next) {
    const transaction = this;
    if (transaction.isNew) {
        transaction.transactionId = "TRX-" + (Math.random() * 100000000000000000).toString(36).substring(2, 10) + (new Date()).getTime().toString(36);
    }
    next();
});

module.exports = mongoose.model('Transaction', TransactionSchema);
