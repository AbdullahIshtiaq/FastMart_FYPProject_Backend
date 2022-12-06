const orderService = require('../services/order.service');

exports.create = (req, res, next) => {
    console.log("In line 4 Create Order");
    console.log(req.body)
    var products = req.body.products.split(':')
    products.pop()
    console.log(products);

    var model = {
        userId: req.body.userId,
        card_Number: req.body.card_Number,
        card_ExpMonth: req.body.card_ExpMonth,
        card_ExpYear: req.body.card_ExpYear,
        card_CVC: req.body.card_CVC,
        card_Name: req.body.card_Name
    }
    var incomingOrder = {
        orderNo: req.body.orderNo,
        paymentMethod: req.body.paymentMethod,
        orderDate: req.body.orderDate,
        quantity: req.body.quantity,
        total: req.body.total,
        orderDiscount: req.body.orderDiscount,
        orderProducts: products
    }


    orderService.createOrder(incomingOrder, model, (error, results) => {
        if (error) {
            console.log("In error")
            //console.log(error);
            return next(error);
        } else {
            console.log("In else")
            console.log(results)
            res.status(200).send({
                message: "Success",
                data: results,
            });
        }
    });
}

exports.createOrderByCash = (req, res, next) => {
    console.log(req.body)
    var products = req.body.products.split(':')
    products.pop()
    console.log(products);

    const dateTime = new Date().toLocaleString();

    var currentDate = dateTime.split(', ')[0];
    currentDate = currentDate.split('/')[1] + "/" + currentDate.split('/')[0] + "/" + currentDate.split('/')[2];

    var incomingOrder = {
        orderUser: req.body.userId,
        orderNo: req.body.orderNo,
        paymentMethod: req.body.paymentMethod,
        orderDate: currentDate,
        orderTime: dateTime.split(', ')[1],
        quantity: req.body.quantity,
        total: req.body.total,
        orderProducts: products,
        orderDiscount: req.body.orderDiscount,
        orderStatus: "Success",
    }

    orderService.createOrderByCash(incomingOrder, (error, results) => {
        if (error) {
            console.log("In error")
            //console.log(error);
            return next(error);
        } else {
            console.log("In else")
            console.log(results)
            res.status(200).send({
                message: "Success",
                data: results,
            });
        }
    });
}

exports.update = (req, res, next) => {
    orderService.updateOrder(req.body, (error, results) => {
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

exports.findOfUser = (req, res, next) => {
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

    var orderNo = req.query.orderNo;

    orderService.getOrders(orderNo, (error, results) => {
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

exports.createPOSOrder = (req, res, next) => {

    console.log(req.body);
    var products = req.body.orderProducts.split(':')
    products.pop()
    console.log(products.length);

    const dateTime = new Date().toLocaleString();

    var currentDate = dateTime.split(', ')[0];
    currentDate = currentDate.split('/')[1] + "/" + currentDate.split('/')[0] + "/" + currentDate.split('/')[2];

    var model = {
        orderNo: req.body.orderNo,
        paymentMethod: req.body.paymentMethod,
        quantity: req.body.quantity,
        total: req.body.total,
        orderProducts: products,
        orderDate: currentDate,
        orderTime: dateTime.split(', ')[1],
        orderStatus: "Success",
    }

    console.log("Line 18 " + model);
    orderService.createPOSOrder(model, (error, results) => {
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

// exports.findAllOfUser = (req, res, next) => {

//     console.log('Line 31')
//     var model = {
//         orderUserID: req.query.orderUserID,
//         pageSize: req.query.pageSize,
//         page: req.query.page,
//     }
//     console.log('Line 37 '+ model)

//     orderService.getUserOrders(model, (error, results) => {
//         if (error) {
//             console.log('Line 41 '+ error)
//             return next(error);
//         } else {
//             console.log('Line 44 '+ results)
//             res.status(200).send({
//                 message: "Success",
//                 data: results,
//             });
//         }
//     });
// }


// exports.findAll = (req, res, next) => {

//     var model = {
//         pageSize: req.query.pageSize,
//         page: req.query.page,
//     }

//     orderService.getOrders(model, (error, results) => {
//         if (error) {
//             console.log('Line 41')
//             return next(error);
//         } else {
//             console.log('Line 44')
//             res.status(200).send({
//                 message: "Success",
//                 data: results,
//             });
//         }
//     });
// }