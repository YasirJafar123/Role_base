const { check } = require('express-validator');

exports.register_validator = [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Email is required').isEmail().normalizeEmail(),
    check('password', 'Password is required').not().isEmpty(),
    check('c_password', 'C_Password is required').not().isEmpty(),
];

exports.login_validator = [
    check('password', 'Password is required').not().isEmpty(),
];


exports.addcategory_validator = [
    check('category_name', 'Name is required').not().isEmpty(),
];

exports.addproduct_validator = [
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
];

