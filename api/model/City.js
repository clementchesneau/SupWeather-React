const mongoose = require('mongoose');
const cityScheme = new mongoose.Schema({
    city: {
        type: String,
        required: true,
    },
    cityId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    lat: {
        type: String,
        required: true,
    },
    lon: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('City', cityScheme);