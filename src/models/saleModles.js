const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Sales = mongoose.model('Sales', saleSchema);

module.exports = Sales;
