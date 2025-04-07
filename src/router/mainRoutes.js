const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const adminRoutes = require('./adminRoutes')
const commonRoutes = require('./commonRoutes')

router.use(userRoutes); 
router.use(adminRoutes); 
router.use(commonRoutes); 

module.exports = router;
