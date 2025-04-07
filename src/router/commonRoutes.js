const express = require('express');
const router =new express.Router();
const categoryController = require('../controller/categoryController');
const productController = require('../controller/productController');
const {authtoken} = require('../middleware/authMiddleware')
const {addcategory_validator, addproduct_validator} = require('../helper/authvalidator');


// common routes
router.post('/create_category',authtoken,addcategory_validator,categoryController.CreateCategory);
router.get('/get_category',authtoken, categoryController.GetCategory);
router.get('/get_category/:id',authtoken, categoryController.getOneCategory);
router.patch('/update_category/:id',authtoken, categoryController.UpdateCategory);
router.delete('/delete_category/:id', authtoken,categoryController.DeleteCategory);

router.post('/create_product',authtoken,addproduct_validator,productController.CreateProduct);
router.get('/get_product',authtoken,productController.GetProduct);
router.patch('/update_product/:id',authtoken,productController.UpdateProduct);
router.delete('/delete_product/:id',authtoken,productController.DeleteProduct);

module.exports = router;
