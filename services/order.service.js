const Order = require('../models/order.model');
const dbConfig = require('../config/db.config');

async function createOrder(params, callback) {

    if (!params.orderNo) {
        return callback({
            message: "Order No Required"
        }, "");
    }
    if (!params.orderProducts) {
        return callback({
            message: "Order Product Required"
        }, "");
    }

    console.log("Service Line 17 "+params);

    const model = Order(params);

    model.save().then((response) => {
        console.log("Line 22 "+response);
        return callback(null, response);
    }).catch((error) => {
        console.log("Line 25 "+error);
        return callback(error);
    });
}

async function getUserOrders(params, callback) {

    const orderUserID = params.orderUserID;

    var condition = {};

    if (orderUserID) {
        condition["orderUserID"] = orderUserID;

        find(condition,params, (error, response) => {
            if (error) {
                return callback(error);
            } else {
                return callback(null, response);
            }
        });

    } else {
        return callback({
            message: "User ID Required"
        }, "");
    }
}

async function getOrders(params, callback) {

    const orderNo= params.orderNo;

    var condition = {};

    if (orderNo) {
        condition["orderNo"] = orderNo;
    }

    find(condition, params, (error, response) => {
        if (error) {
            return callback(error);
        } else {
            return callback(null, response);
        }
    });
}

async function find(condition, params, callback) {

    let perPage = Math.abs(params.pageSize) || dbConfig.PAGE_SIZE;
    let page = (Math.abs(params.page) || 1) - 1;

    Order.find(condition, "orderNo orderDate paymentMethod quantity total")
        .populate("orderUser", "username")
        .populate("orderProducts", "productBarcode productId productName productImg productShortDesc productPrice")
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


module.exports = {
    createOrder,
    getUserOrders,
    getOrders,
}