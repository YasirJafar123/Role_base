const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const User = require('../models/userModels');

dotenv.config();

const authtoken = async (req, res, next) => {
    try {
        const token = req.cookies.authtoken;

        if (!token) {
            return res.status(401).send({
                success: false,
                message: 'Access Denied: No token provided. Please Login First',
            });
        }

        const verifyuser = jwt.verify(token, process.env.Jwt_Secret_Key);
        const user = await User.findById(verifyuser._id).populate('role').populate('permissions');

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }

        req.user = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role ? user.role.role_name : null ,
        };

        req.token = token;
        next();
    } catch (e) {
        res.status(500).send({
            success: false,
            message: 'Server error',
            error: e.message
        });
    }
};

module.exports = { authtoken };
