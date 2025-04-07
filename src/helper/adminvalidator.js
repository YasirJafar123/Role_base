const { check } = require('express-validator');

exports.createuser_validator = [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Email is required').isEmail().normalizeEmail(),
];

exports.addpermission_validator = [
    check('permission_name', 'permission name is required').not().isEmpty(),
];
exports.delpermission_validator = [
    check('id', 'Id is required').not().isEmpty(),
];
exports.updpermission_validator = [
    check('id', 'Id is required').not().isEmpty(),
    check('permission_name', 'permission name is required').not().isEmpty(),
]

exports.addrole_validator = [
    check('role_name', 'Role Name is required').not().isEmpty(),
    check('permissions', 'permission id is required').not().isEmpty(),
]