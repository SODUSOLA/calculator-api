const mongoose = require('mongoose');

const calculationSchema = new mongoose.Schema({
    num1: Number,
    num2: Number,
    operation: String,
    result: mongoose.Schema.Types.Mixed, // mixed to allow error strings like "division by zero"
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Calculation', calculationSchema);
