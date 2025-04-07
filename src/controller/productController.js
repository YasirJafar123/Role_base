const { validationResult } = require('express-validator');
const Product = require("../models/productModels");

const CreateProduct = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({
                success: false,
                message: "Validation errors",
                errors: errors.array()
            });
        }
        const { name, description, categories } = req.body;
        const newproduct = new Product({
            name,
            description,
            categories
        });
        const product = await newproduct.save();
        if (!product) {
            return res.status(400).send({
                success: false,
                message: "Product does't Created",
            });
        }
        return res.status(201).send({
            success: true,
            message: 'Product Created Successfully',
            data: product
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: "Server Error", error: error.message,
        });
    }
};

const GetProduct = async (req, res) => {
    try {
        const product = await Product.find({}).populate('categories', '-__v ').sort({ date: -1 });
        if (product) {
            return res.status(201).send({
                success: true,
                message: 'Product Created Successfully',
                Total_Product: product.length,
                data: product
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

const UpdateProduct = async (req, res) => {
    try {
        const _id = req.params.id
        const updateproduct = await Product.findByIdAndUpdate(_id,
            { ...req.body },
            {
                new: true
            })
        if (updateproduct) {
            return res.status(201).send({
                success: true,
                message: 'Product Updated Successfully',
                date: updateproduct
            })
        } else {
            return res.status(404).send({
                success: false,
                message: 'Product does not fetch through id',
            })
        }
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: "Server Error", error: error.message,
        });
    }
};

const DeleteProduct = async (req, res) => {
    try {
        const _id = req.params.id;
        const product = await Product.findByIdAndDelete({ _id });
        if (product) {
            return res.status(201).send({
                success: true,
                message: 'Product deleted Successfully',
                data: product
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

module.exports = {
    CreateProduct,
    GetProduct,
    UpdateProduct,
    DeleteProduct
}