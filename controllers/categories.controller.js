const categoryService = require('../services/category.service');
const upload = require('../middlewares/category.upload');

exports.create = (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            next(err)
        } else {
            const path = req.file != undefined ? req.file.path.replace(/\\/g, "/") : "";
            var model = {
                categoryName: req.body.categoryName,
                categoryDesc: req.body.categoryDesc,
                categoryImg: path != "" ? "/" + path : "",
            }

            categoryService.createCategory(model, (error, results) => {
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
        categoryName: req.query.categoryName,
        pageSize: req.query.pageSize,
        page: req.query.page,
    }

    categoryService.getCategories(model, (error, results) => {
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
        categoryId: req.params.id,
    }

    categoryService.getCategoryById(model, (error, results) => {
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
    upload(req, res, function (err) {
        if (err) {
            next(err)
        } else {
            const path = req.file != undefined ? req.file.path.replace(/\\/g, "/") : "";
            var model = {
                categoryId: req.params.id,
                categoryName: req.body.categoryName,
                categoryDesc: req.body.categoryDesc,
                categoryImg: path != "" ? "/" + path : "",
            }

            categoryService.updateCategory(model, (error, results) => {
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

exports.delete = (req, res, next) => {

    var model = {
        categoryId: req.params.id,
    }
    console.log("In Delete");

    categoryService.deleteCategory(model, (error, results) => {

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
