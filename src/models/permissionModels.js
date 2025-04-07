const mongoose = require('mongoose');


const permissionSchema = new mongoose.Schema({
    permission_name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    actions: {
        type: [String],
        enum: ['create', 'read', 'update', 'delete'],
        default: ['read']
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Permission = mongoose.model('Permission', permissionSchema);
module.exports = Permission;
