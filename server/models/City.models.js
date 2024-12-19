const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    cityName: {
        type: String,
        required: true,
        unique: true,
        lowercase:true,
        trim: true
    }
}, {timestamps: true});

const City = mongoose.model('City', citySchema);
module.exports = City;
