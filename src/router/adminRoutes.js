const express = require('express');
const router = express.Router();
const {authtoken} = require('../middleware/authMiddleware');
const {roleAccess,PermissionMiddleware} = require('../middleware/adminverifyMiddleware');
const adminController = require('../controller/admin/adminController');

const {createuser_validator, addpermission_validator, delpermission_validator, 
    updpermission_validator,addrole_validator} = require('../helper/adminvalidator');


// create user with permission 
router.post('/create_user', authtoken,roleAccess(['admin']), createuser_validator,adminController.CreateSubadmin);


router.post('/add_permission', authtoken,roleAccess(['admin']), addpermission_validator,adminController.Addpermission);
router.get('/get_permission', authtoken,roleAccess(['admin']),adminController.Getpermission);
router.get('/get_permission/:id', authtoken,roleAccess(['admin']),adminController.GetOnepermission);
router.patch('/update_permission/:id', authtoken,roleAccess(['admin']), updpermission_validator,adminController.Updatepermission);
router.post('/delete_permission', authtoken,roleAccess(['admin']), delpermission_validator,adminController.Deletepermission);

// role 
router.post('/create_role', authtoken,roleAccess(['admin']), addrole_validator,adminController.CreateRole);
router.get('/get_role', authtoken,roleAccess(['admin']),adminController.GetRole);
router.delete('/delete_role/:id', authtoken,roleAccess(['admin']),adminController.DeleteRole);


// sales manager routes

router.get('/all_user_permission',authtoken,roleAccess(['admin','sales_manager','account_manager','user']),adminController.salesman);

router.get('/account_manag_permission', authtoken,roleAccess(['account_manager']),PermissionMiddleware("account_manager"),adminController.salesman);

router.get('/sales_manag_permission', authtoken,roleAccess(['admin','sales_manager']),PermissionMiddleware("sales_manager"),adminController.salesman);


module.exports = router;
