const Product = require('../models/product.model');
const dbConfig = require('../config/db.config');

async function createProduct(params, callback) {

    if (!params.productName) {
        return callback({
            message: "Product Name Required"
        }, "");
    }

    if (!params.category) {
        return callback({
            message: "Category Required"
        }, "");
    }

    const model = Product(params);

    model.save().then((response) => {
        return callback(null, response);
    }).catch((error) => {
        return callback(error);
    });
}

async function getProducts(params, callback) {

    const productName = params.productName;
    const categoryId = params.categoryId;

    var condition = {};

    if (productName) {
        condition["productName"] = {
            $regex: new RegExp(productName), $options: "i"
        };
    }

    if (categoryId) {
        condition["category"] = categoryId;
    }

    let perPage = Math.abs(params.pageSize) || dbConfig.PAGE_SIZE;
    let page = (Math.abs(params.page) || 1) - 1;

    Product.find(condition, "productName productShortDesc productPrice productSalePrice productImg productSKU productType stockStatus")
        .populate("category", "categoryName categoryImg")
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

async function getProductById(params, callback) {

    const productId = params.productId;

    Product.findById(productId)
        .populate("category", "categoryName categoryImg")
        .then((response) => {
            console.log(response);
            return callback(null, response);
        }).catch((error) => {
            console.log(error);
            return callback(error);
        });
}

async function updateProduct(params, callback) {

    const productId = params.productId;

    Product.findByIdAndUpdate(productId, params, { useFindAndModify: false })
        .then((response) => {
            if (!response) {
                callback("Not Found Product By ID: " + productId);
            }
            else {
                callback(null, response);
            }
        }).catch((error) => {
            console.log(error);
            return callback(error);
        });
}

async function deleteProduct(params, callback) {

    const productId = params.productId;

    Product.findByIdAndDelete(productId)
        .then((response) => {
            if (!response) {
                callback("Not Found Product By ID: " + productId);
            }
            else {
                callback(null, response);
            }
        }).catch((error) => {
            console.log(error);
            return callback(error);
        });
}

async function getProductsTotal(callback) {

    var condition = {};

    Product.find(condition, "productName productShortDesc productPrice productSalePrice productImg productSKU productType stockStatus")
        .populate("category", "categoryName categoryImg")
        .then((response) => {
            console.log(response);
            return callback(null, response);
        }).catch((error) => {
            console.log(error);
            return callback(error);
        });
}

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductsTotal
}