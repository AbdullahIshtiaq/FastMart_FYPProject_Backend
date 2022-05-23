
const Category = require('../models/category.model');
const dbConfig = require('../config/db.config');

async function createCategory(params, callback) {

    if (!params.categoryName) {
        return callback({
            message: "Category Namme Required"
        }, "");
    }

    const model = Category(params);

    model.save().then((response) => {
        return callback(null, response);
    }).catch((error) => {
        return callback(error);
    });
}

async function getCategories(params, callback) {

    const categoryName = params.categoryName;

    var condition = categoryName ? {
        categoryName: { $regex: new RegExp(categoryName), $options: "i" }

    } : {};

    let perPage = Math.abs(params.pageSize) || dbConfig.PAGE_SIZE;
    let page = (Math.abs(params.page) || 1) - 1;

    Category.find(condition, "categoryName categoryImg")
        .limit(perPage)
        .skip(perPage * page)
        .then((response) => {
            console.log(response);
            return callback(null, response);
        }).catch((error) => {
            console.log(error);
            return callback(error);
        });
}

async function getCategoryById(params, callback) {

    const categoryId = params.categoryId;

    Category.findById(categoryId)
        .then((response) => {
            if (!response) {
                callback("Not Found Category By ID: " + categoryId);
            }
            else {
                callback(null, response);
            }
        }).catch((error) => {
            return callback(error);
        });
}

async function updateCategory(params, callback) {

    const categoryId = params.categoryId;

    Category.findByIdAndUpdate(categoryId, params, { useFindAndMotify: false })
        .then((response) => {
            if (!response) {
                callback("Not Found Category By ID: " + categoryId);
            }
            else {
                callback(null, response);
            }
        }).catch((error) => {
            return callback(error);
        });
}

async function deleteCategory(params, callback) {

    const categoryId = params.categoryId;

    Category.findByIdAndDelete(categoryId)
        .then((response) => {
            if (!response) {
                callback("Not Found Category By ID: " + categoryId);
            }
            else {
                callback(null, response);
            }
        }).catch((error) => {
            return callback(error);
        });
}

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
}