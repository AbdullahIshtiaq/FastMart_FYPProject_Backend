const orderService = require('../services/order.service');

exports.create = (req, res, next) => {
    
    var products = req.body.orderProducts.split(':')

    var model = {
        orderNo: req.body.orderNo,
        orderUser: req.body.orderUser,
        paymentMethod: req.body.paymentMethod,
        orderDate: req.body.orderDate,
        quantity: req.body.quantity,
        total: req.body.total,
        orderProducts: products
    }

    orderService.createOrder(model, (error, results) => {
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

exports.findAllOfUser = (req, res, next) => {

    var model = {
        orderUserID: req.query.orderUserID,
        pageSize: req.query.pageSize,
        page: req.query.page,
    }

    orderService.getUserOrders(model, (error, results) => {
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


exports.findAll = (req, res, next) => {

    var model = {
        pageSize: req.query.pageSize,
        page: req.query.page,
    }

    orderService.getOrders(model, (error, results) => {
        if (error) {
            console.log('Line 41')
            return next(error);
        } else {
            console.log('Line 44')
            res.status(200).send({
                message: "Success",
                data: results,
            });
        }
    });
}