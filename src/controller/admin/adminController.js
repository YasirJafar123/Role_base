const bcrypt = require('bcryptjs');
const slugify = require('slugify');
const randomstring = require('randomstring');
const Permission = require('../../models/permissionModels');
const User = require('../../models/userModels');
const Role = require('../../models/roleModels');

const { validationResult } = require('express-validator');

const CreateSubadmin = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({
                success: false,
                message: "Validation errors",
                errors: errors.array()
            });
        }

        const { username, email, role } = req.body;

        const slug = slugify(username, { lower: true, strict: true });
        const existingSlug = await User.findOne({ slug });

        if (existingSlug) {
            return res.status(400).send({
                success: false,
                message: 'Username Already Exists'
            });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).send({
                success: false,
                message: 'Email Already Exists',
            });
        }

        const password = randomstring.generate(6);
        console.log(password);
        const hashedPassword = await bcrypt.hash(password, 10);

        if (role && role == "admin") {
            return res.status(400).send({
                success: false,
                message: "You can't create an Admin",
            });
        }

        const roleData = await Role.findById(role).populate('permissions');
        if (!roleData) {
            return res.status(400).send({
                success: false,
                message: `Role does not Fetch through Id`,
            });
        }

        const permissions = roleData.permissions.map(permission => permission._id);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            slug,
            role: roleData._id,
            permissions,
        });

        const createdUser = await newUser.save();

        if (createdUser) {
            return res.status(201).send({
                success: true,
                message: 'Account Created Successfully',
                data: createdUser
            });
        }

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


const Addpermission = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({
                success: false,
                message: "Validation errors",
                errors: errors.array()
            });
        }
        const { permission_name, actions } = req.body;

        const permissionExist = await Permission.findOne({ permission_name });
        if (permissionExist) {
            return res.status(400).send({
                success: false,
                message: "Permission already exists"
            });
        }

        const permission = new Permission({
            permission_name,
            actions: actions || ['read'] 
        });

        await permission.save();

        return res.status(201).send({
            success: true,
            message: "Permission added successfully",
            data: permission
        });

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const Getpermission = async (req, res) => {
    try {
        const permissions = await Permission.find().sort({ date: -1 });

        return res.status(200).send({
            success: true,
            message: "Permissions fetched successfully",
            total: permissions.length,
            data: permissions
        });

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const GetOnepermission= async (req, res) => {
    try {
        const { id } = req.params;
        const permission = await Permission.findById(id);

        if (!permission) {
            return res.status(404).send({
                success: false,
                message: "Permission not found"
            });
        }

        return res.status(200).send({
            success: true,
            message: "Permission fetched successfully",
            data: permission
        });

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const Updatepermission = async (req, res) => {
    try {
        const { id } = req.params;
        const { permission_name, actions } = req.body;

        const permission = await Permission.findById(id);
        if (!permission) {
            return res.status(404).send({
                success: false,
                message: "Permission not found"
            });
        }

        if (permission_name) permission.permission_name = permission_name;
        if (actions) permission.actions = actions;

        await permission.save();

        return res.status(200).send({
            success: true,
            message: "Permission updated successfully",
            data: permission
        });

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

const Deletepermission = async (req, res) => {
    try {
        const { id } = req.params;
        const permission = await Permission.findByIdAndDelete(id);

        if (!permission) {
            return res.status(404).send({
                success: false,
                message: "Permission not found"
            });
        }

        return res.status(200).send({
            success: true,
            message: "Permission deleted successfully"
        });

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


const salesman = async (req, res) => {
    try {
        return res.status(201).send({
            success: true,
            message: "Permission only admin and Sales Manager",
            data: req.user
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};


// role assign 

const CreateRole = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({
                success: false,
                message: "Validation errors",
                errors: errors.array()
            });
        }

        const { role_name, permissions } = req.body;

        const existRole = await Role.findOne({ role_name });
        if (existRole) {
            return res.status(400).send({
                success: false,
                message: "Role already exists",
            });
        }

        const newRole = new Role({
            role_name,
            permissions // Assigning permissions (if any)
        });

        const role = await newRole.save();

        return res.status(201).send({
            success: true,
            message: "Role created successfully",
            data: role
        });

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};
const GetRole = async (req, res) => {
    try {
        const role = await Role.find({}).sort({ date: -1 });
        if (role) {
            return res.status(201).send({
                success: true,
                message: "Role fetch Successfully",
                Total_Role: role.length,
                data: role
            });
        } else {
            return res.status(400).send({
                success: false,
                message: "Role does't fetch",
            });
        }
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};
const DeleteRole = async (req, res) => {
    try {
        const _id = req.params.id;
        const role = await Role.findByIdAndDelete(_id)
        if (role) {
            return res.status(201).send({
                success: true,
                message: "Role Deleted Successfully",
                data: role
            });
        } else {
            return res.status(404).send({
                success: false,
                message: "Role does't fetch through id",
            });
        }
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}

module.exports = {
    CreateSubadmin,
    Addpermission,
    Getpermission,
    GetOnepermission,
    Updatepermission,
    Deletepermission,
    CreateRole,
    GetRole,
    DeleteRole,
    salesman,
}