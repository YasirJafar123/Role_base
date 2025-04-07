const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
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
    account: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
