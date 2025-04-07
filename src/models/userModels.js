const mongoose = require("mongoose");

    const userSchema = new mongoose.Schema({
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        slug: {
            type: String,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role',
            default: null
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


const User = mongoose.model("User", userSchema);
module.exports = User;
