const productService = require('../services/products.service');
const upload = require('../middlewares/product.upload');

exports.create = (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            next(err)
        } else {
            const path = req.file != undefined ? req.file.path.replace(/\\/g, "/") : "";

            var model = {
                productName: req.body.productName,
                category: req.body.category,
                productShortDesc: req.body.productShortDesc,
                productDesc: req.body.productDesc,
                productPrice: req.body.productPrice,
                productRetailPrice: req.body.productRetailPrice,
                stockStatus: req.body.stockStatus,
                productBarcode: req.body.productBarcode,
                productImg: path != "" ? "/" + path : "",
            }

            productService.createProduct(model, (error, results) => {
                if (error) {
                    return next(error);
                } else {
                    res.status(200).send({
                        message: "Success",
                        data: results,
                    });
                }
            });
        }
    });
}

exports.findAll = (req, res, next) => {

    var model = {
        productName: req.query.productName,
        categoryId: req.query.categoryId,
        pageSize: req.query.pageSize,
        page: req.query.page,
    }

    productService.getProducts(model, (error, results) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).send({
                message: "Success",
                data: results,
            });
        }
    });
}

exports.findOne = (req, res, next) => {

    var model = {
        productId: req.params.id
    }

    productService.getProductById(model, (error, results) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).send({
                message: "Success",
                data: results,
            });
        }
    });
}

exports.findByBarcode = (req, res, next) => {
    console.log("Line 77: IN QR " +req.query.productBarcode)

    var model = {
        productBarcode: req.query.productBarcode
    }

    productService.getProductByBarcode(model, (error, results) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).send({
                message: "Success",
                data: results,
            });
        }
    });
}

exports.getProductsForAdmin = (req, res, next) => {

    productService.getProductsForAdmin((error, results) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).send({
                message: "Success",
                data: results,
            });
        }
    });
}

exports.update = (req, res, next) => {
    // upload(req, res, function (err) {
    //     if (err) {
    //         next(err)
    //     } else {
            console.log("Line 114: In Update Product");
            //console.log(req.file);
            console.log(req.body);
            //const path = req.file != undefined ? req.file.path.replace(/\\/g, "/") : "";
            var model = {
                productId: req.params.id,
                productName: req.body.productName,
                category: req.body.category,
                productShortDesc: req.body.productShortDesc,
                productDesc: req.body.productDesc,
                productPrice: req.body.productPrice,
                productRetailPrice: req.body.productRetailPrice,
                productBarcode: req.body.productBarcode,
                stockStatus: req.body.stockStatus,
                //productImg: path != "" ? "/" + path : "",
            }
            console.log("Line 130: In Update Product");
            console.log(model);
            productService.updateProduct(model, (error, results) => {
                if (error) {
                    console.log("In Update Product Error");
                    console.log(error);
                    return next(error);
                } else {
                    console.log("In Update Product Response");
                    console.log(results);
                    res.status(200).send({
                        message: "Success",
                        data: results,
                    });
                }
            });
    //     }
    // });
}

exports.delete = (req, res, next) => {

    var model = {
        productId: req.params.id,
    }
    console.log("In Delete");

    productService.deleteProduct(model, (error, results) => {

        if (error) {
            return next(error);
        } else {
            res.status(200).send({
                message: "Success",
                data: results,
            });
        }
    });
}
