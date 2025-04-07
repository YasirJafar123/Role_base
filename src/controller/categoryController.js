const Category = require('../models/categoryModel');

const { validationResult } = require('express-validator');
const CreateCategory = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({
                success: false,
                message: "Validation errors",
                errors: errors.array()
            });
        }
        const { category_name } = req.body;
        const existingname = await Category.findOne({ name: category_name });
        if (existingname) {
            return res.status(400).send({
                success: false,
                message: 'Name Alread Exist'
            })
        }
        const category = await Category.create({ name: category_name });
        if (category) {
            res.status(201).send({
                success: true,
                message: 'Category is Created',
                data: category,
            });
        } else {
            return res.status(400).send({
                success: false,
                message: "Category does not Created",
            });
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Server Error", error: error.message,
        });
    }
};

const GetCategory = async (req, res) => {
    try {
        const Allcategory = await Category.find({}).sort({ 'date': -1 });
        if (Allcategory) {
            return res.status(201).send({
                success: true,
                message: 'All Category fetch successfuly',
                Total_Category: Allcategory.length,
                data: Allcategory
            });
        }
        else {
            return res.status(404).send({
                success: false,
                message: 'All Category does not fetch'
            })
        }

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Server error', error: error.message
        })
    }
};

const getOneCategory = async (req, res) => {
    try {
        const _id = req.params.id;
        const category = await Category.findById(_id).select('name')
        if (category) {
            return res.status(201).send({
                success: true,
                message: 'Category fetch through Id', data: category
            });
        }
        else {
            return res.status(404).send({
                success: false,
                message: 'Category does not fetch through Id'
            })
        }

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Server error', error: error.message
        })
    }
};

const UpdateCategory = async (req, res) => {
    try {
        const _id = req.params.id;
        const { category_name } = req.body;

        const existCategory = await Category.findById(_id);
        if (!existCategory) {
            return res.status(404).send({
                success: false,
                message: "Category not found",
            });
        }

        const duplicateCategory = await Category.findOne({ name: category_name });
        if (duplicateCategory && duplicateCategory._id.toString() !== _id) {
            return res.status(400).send({
                success: false,
                message: "Category name already exists",
            });
        }

        const category = await Category.findByIdAndUpdate(_id, { name: category_name },
            { new: true });

        return res.status(200).send({
            success: true,
            message: "Category updated successfully",
            data: category
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};


const DeleteCategory = async (req, res) => {
    try {
        const _id = req.params.id;
        const deletecategory = await Category.findByIdAndDelete(_id)
        if (deletecategory) {
            return res.status(201).send({
                success: true,
                message: 'Category is Deleted through Id', data: deletecategory
            });
        }
        else {
            return res.status(400).send({
                success: false,
                message: 'Category does not fetch through Id'
            })
        }

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Server error', error: error.message
        })
    }
};
module.exports = {
    CreateCategory,
    GetCategory,
    getOneCategory,
    UpdateCategory,
    DeleteCategory
};
