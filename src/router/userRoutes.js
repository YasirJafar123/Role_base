const express = require('express');
const router =new express.Router();
const userController = require('../controller/userController');
const {authtoken} = require('../middleware/authMiddleware')
const { register_validator,login_validator } = require('../helper/authvalidator');
const {roleAccess} = require('../middleware/adminverifyMiddleware');


router.post('/register', register_validator, userController.Signup);
router.post('/login', login_validator, userController.UserLogin);
router.post('/logout', userController.UserLogout);

router.get('/user',authtoken,roleAccess, userController.GetUser);
router.patch('/user/:id',authtoken,roleAccess, userController.UpdateUser);
router.delete('/user/:id',authtoken,roleAccess, userController.DeleteUser);


router.get('/profile',authtoken, userController.getprofile);
module.exports = router;
