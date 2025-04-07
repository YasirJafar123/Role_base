const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    role_name: {
        type: String,
        enum: ['admin', 'sales_manager', 'account_manager', 'user'],
        required: true,
        unique: true,
        lowercase: true,
        trim:true
    },
    permissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission'
    }],
    date: {
        type: Date,
        default: Date.now
    }
});

const Role = mongoose.model('Role', roleSchema);
module.exports = Role;
