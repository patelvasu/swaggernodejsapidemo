// models/User.js
const mongoose = require('mongoose');
const crypotHash = require('../utils/crypotHash');
const UserSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true,
        set: (email) => email.toLowerCase()
     },
    password: { type: String, required: true },
    termsAccepted: { type: Boolean, required: true },
    token: { type: String, default: '' },
    role: { type: String, enum:["user","admin"],default: 'user' },
    balance: { type: Number, default: 0 },
    isActive:{ type: Boolean, default: true },
    isDeleted:{ type: Boolean, default: false }
});

UserSchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified('password')) return next();
    user.password=crypotHash.sha256HashString(user.password);
    next();
});
UserSchema.methods.validatePassword =async function (password){
    console.log("crypotHash.sha256HashString(password)",crypotHash.sha256HashString(password));
    
    return crypotHash.sha256HashString(password)=== this.password;
};
module.exports = mongoose.model('User', UserSchema);