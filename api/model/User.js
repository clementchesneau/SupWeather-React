const mongoose = require('mongoose');
const userScheme = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 4,
        max: 100
    },
    email: {
        type: String,
        required: true,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 512
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userScheme);