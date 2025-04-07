const User = require('../models/userModels')
const Role = require('../models/roleModels')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const slugify = require('slugify')

dotenv.config();
const { validationResult } = require('express-validator');
const { permission } = require('process');

const Signup = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({
                success: false,
                message: "Validation errors",
                errors: errors.array()
            });
        }
        const { username, email, password, c_password, role } = req.body
        if (password !== c_password) {
            return res.status(400).send({
                success: false,
                message: "Passwords do not match"
            });
        }
        const slug = slugify(username, { lower: true, strict: true });

        const existingslug = await User.findOne({ slug });
        if (existingslug) {
            return res.status(400).send({
                success: false,
                message: 'Username Alread Exist'
            })
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).send({
                success: false,
                message: 'Email Already Exists',
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const defaultRole = await Role.findOne({ role_name: "user" });
        const roles = defaultRole ? defaultRole._id : null;

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            slug,
            role: roles
        });
        const createuser = await newUser.save();

        if (createuser) {
            return res.status(201).send({
                success: true,
                message: 'Your Account has been Created Successfully', data: createuser
            });
        }
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}

const UserLogin = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({
                success: false,
                message: "Validation errors",
                errors: errors.array()
            });
        }
        const { emailOrUsername, password, } = req.body;
        const user = await User.findOne({
            $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
        }).populate("permissions", "permission_name actions")
        .populate({
            path: "role",
            populate: {
                path: "permissions",
                select: "permission_name actions"
            }
        });
        if (!user) {
            return res.status(400).send({
                success: false,
                message: "Invalid email or username",
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({
                success: false,
                message: "Invalid email/username or password",
            });
        }

        const userPermissions = [
            ...(user.role ? user.role.permissions.map(p => ({
                id: p._id.toString(),
                name: p.permission_name,
                actions: p.actions || []
            })) : []),
            ...user.permissions.map(p => ({
                id: p._id.toString(),
                name: p.permission_name,
                actions: p.actions || []
            }))
        ];        
        const uniquePermissions = userPermissions.filter((value, index, self) =>
            index === self.findIndex((t) => (
                t.id === value.id
            ))
        );
        const token = jwt.sign({ _id: user._id, role: user.role, permissions: uniquePermissions }, process.env.Jwt_Secret_Key, {
            expiresIn: "1h",
        });

        res.cookie("authtoken", token, {
            maxAge: 1 * 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        });

        return res.status(201).send({
            success: true,
            message: "User logged in successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role?.role_name || "user",
                permissions: uniquePermissions
            }
        });

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

const UserLogout = async (req, res) => {
    try {
        res.clearCookie('authtoken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        });
        return res.status(201).send({
            success: true,
            message: 'Logout successful',
        });
    }
    catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Server error', error: error.message,
        });
    }
};

const GetUser = async (req, res) => {
    try {
        const user = await User.find({}).select('-password -slug').sort({ date: -1 });
        if (user) {
            return res.status(201).send({
                success: true,
                message: 'Product Created Successfully',
                user: user.length,
                data: user
            })
        }
        else {
            return res.status(400).send({
                success: false,
                message: "Product does't Fetch",
            });
        }
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: "Server Error", error: error.message,
        });
    }
};

const UpdateUser = async (req, res) => {
    try {
        const _id = req.params.id;
        const { username, password, c_password } = req.body;

        if (password !== c_password) {
            return res.status(400).send({
                success: false,
                message: "Password doesn't match"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }
        let updatedSlug = user.slug;
        if (username && username !== user.username) {
            updatedSlug = slugify(username, { lower: true, strict: true });
            const existingSlugUser = await User.findOne({ slug: updatedSlug, _id: { $ne: _id } });
            if (existingSlugUser) {
                return res.status(400).send({
                    success: false,
                    message: "Slug already exists for another user"
                });
            }
        }

        user.username = username || user.username;
        user.password = hashedPassword;
        user.slug = updatedSlug;

        const updatedUser = await user.save();

        return res.status(200).send({
            success: true,
            message: "User updated successfully",
            data: updatedUser
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};

const DeleteUser = async (req, res) => {
    try {
        const _id = req.params.id;
        const user = await User.findByIdAndDelete(_id);
        if (user) {
            return res.status(201).send({
                success: true,
                message: 'User Deleted Successfully',
                data: user
            })
        }
        else {
            return res.status(400).send({
                success: false,
                message: "User does't Fetch",
            });
        }

    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: "Server Error", error: error.message,
        });
    }
}

const getprofile = async (req, res) => {
    try {
        return res.status(201).send({
            success: true,
            message: 'User data',
            user: {
                id: req.user._id,
                username: req.user.username,
                email: req.user.email,
                role: req.user.role
            }
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};


module.exports = {
    Signup,
    UserLogin,
    UserLogout,
    GetUser,
    UpdateUser,
    DeleteUser,
    getprofile
}