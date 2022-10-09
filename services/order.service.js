const user = require('../models/user.model');
const cards = require('../models/cards.model');
const order = require('../models/order.model');
const dbConfig = require('../config/db.config');


const stripeService = require('../services/stripe.service');

async function createOrder(incomingOrder, params, callback) {
    console.log("In create order Line 8");
    user.findOne({ _id: params.userId }, async function (err, userDB) {
        if (err) {
            console.log("In create order Line 11");
            return callback(err);
        }
        else {
            console.log("In create order Line 15");
            var model = {};
            if (!userDB.stripeCustomerID) {
                console.log("In create order Line 18");
                await stripeService.createCustomer({
                    "name": userDB.username,
                    "email": userDB.email
                }, (err, result) => {
                    if (err) {
                        console.log("In create order Line 24");
                        return callback(err);
                    }
                    if (result) {
                        console.log("In create order Line 28");
                        userDB.stripeCustomerID = result.id;
                        userDB.save();

                        model.stripeCustomerID = result.id;
                    }
                }
                );
            } else {
                console.log("In create order Line 37");
                model.stripeCustomerID = userDB.stripeCustomerID;
            }

            console.log("In create order Line 41");
            cards.findOne({
                customerId: model.stripeCustomerID,
                cardNumber: params.card_Number,
                cardExpMonth: params.card_ExpMonth,
                cardExpYear: params.card_ExpYear,
            }, async function (err, cardDB) {
                if (err) {
                    console.log("In create order Line 49");
                    return callback(err);
                } else {
                    console.log("In create order Line 52");
                    if (!cardDB) {
                        console.log("In create order Line 54");
                        await stripeService.addCard({
                            "card_Name": params.card_Name,
                            "card_Number": params.card_Number,
                            "card_ExpMonth": params.card_ExpMonth,
                            "card_ExpYear": params.card_ExpYear,
                            "card_CVC": params.card_CVC,
                            "customer_Id": model.stripeCustomerID,
                        }, (err, result) => {
                            if (err) {
                                console.log("In create order Line 64");
                                console.log(err);
                                return callback(err);
                            }

                            if (result) {
                                console.log("In create order Line 69");
                                const cardModel = new cards({
                                    cardId: result.card,
                                    cardName: params.card_Name,
                                    cardNumber: params.card_Number,
                                    cardExpMonth: params.card_ExpMonth,
                                    cardExpYear: params.card_ExpYear,
                                    cardCVC: params.card_CVC,
                                    customerId: model.stripeCustomerID,

                                });

                                cardModel.save();
                                model.cardId = result.card;

                            }

                        });

                    } else {
                        console.log("In create order Line 89");
                        model.cardId = cardDB.cardId;
                    }

                    console.log("In create order Line 93");
                    await stripeService.generatePaymentIntent({
                        "receipt_email": userDB.email,
                        "amount": incomingOrder.total,
                        "card_id": model.cardId,
                        "customer_id": model.stripeCustomerID,
                    }, (err, result) => {
                        if (err) {
                            console.log("In create order Line 101");
                            return callback(err);
                        }
                        if (result) {
                            console.log("In create order Line 105");
                            model.paymentIntentId = result.id;
                            model.client_secret = result.client_secret;
                        }
                    });

                    console.log("In create order Line 111");
                    console.log(model);
                    console.log(incomingOrder.orderProducts);
                    const orderModel = new order({
                        orderNo: incomingOrder.orderNo,
                        orderUser: params.userId,
                        orderProducts: incomingOrder.orderProducts,
                        paymentMethod: incomingOrder.paymentMethod,
                        orderDate: incomingOrder.orderDate,
                        quantity: incomingOrder.quantity,
                        total: incomingOrder.total,
                        orderStatus: "pending",
                    });

                    orderModel.save().then((response) => {
                        console.log("In create order Line 124");
                        model.orderId = response._id;
                        return callback(null, model);

                    }).catch((error) => {
                        console.log("In create order Line 129");
                        return callback(error);
                    });

                }
            });
        }
    });
}

async function createPOSOrderByCard(incomingOrder, params, callback) {
    console.log("In create order Line 145");
    user.findOne({ _id: params.userId }, async function (err, userDB) {
        if (err) {
            console.log("In create order Line 11");
            return callback(err);
        }
        else {
            console.log("In create order Line 15");
            var model = {};
            if (!userDB.stripeCustomerID) {
                console.log("In create order Line 18");
                await stripeService.createCustomer({
                    "name": userDB.username,
                    "email": userDB.email
                }, (err, result) => {
                    if (err) {
                        console.log("In create order Line 24");
                        return callback(err);
                    }
                    if (result) {
                        console.log("In create order Line 28");
                        userDB.stripeCustomerID = result.id;
                        userDB.save();

                        model.stripeCustomerID = result.id;
                    }
                }
                );
            } else {
                console.log("In create order Line 37");
                model.stripeCustomerID = userDB.stripeCustomerID;
            }

            console.log("In create order Line 41");

            await stripeService.addCard({
                "card_Name": params.card_Name,
                "card_Number": params.card_Number,
                "card_ExpMonth": params.card_ExpMonth,
                "card_ExpYear": params.card_ExpYear,
                "card_CVC": params.card_CVC,
                "customer_Id": model.stripeCustomerID,
            }, (err, result) => {
                if (err) {
                    console.log("In create order Line 64");
                    console.log(err);
                    return callback(err);
                }
                if (result) {
                    console.log("In create order Line 69");
                    model.cardId = result.card;
                }
            });

            console.log("In create order Line 93");
            await stripeService.generatePaymentIntent({
                "receipt_email": userDB.email,
                "amount": incomingOrder.total,
                "card_id": model.cardId,
                "customer_id": model.stripeCustomerID,
            }, (err, result) => {
                if (err) {
                    console.log("In create order Line 101");
                    return callback(err);
                }
                if (result) {
                    console.log("In create order Line 105");
                    model.paymentIntentId = result.id;
                    model.client_secret = result.client_secret;
                }
            });

            console.log("In create order Line 111");
            console.log(model);
            console.log(incomingOrder.orderProducts);
            const orderModel = new order({
                orderNo: incomingOrder.orderNo,
                orderUser: params.userId,
                orderProducts: incomingOrder.orderProducts,
                paymentMethod: incomingOrder.paymentMethod,
                orderDate: incomingOrder.orderDate,
                quantity: incomingOrder.quantity,
                total: incomingOrder.total,
                orderStatus: "pending",
            });

            orderModel.save().then((response) => {
                console.log("In create order Line 124");
                model.orderId = response._id;
                return callback(null, model);

            }).catch((error) => {
                console.log("In create order Line 129");
                return callback(error);
            });
        }
    });
}

async function updateOrder(params, callback) {
    console.log("Order Service Line 142 " + params.transactionId);
    var model = {
        orderStatus: params.status,
        transactionId: params.transactionId,
    };

    order.findByIdAndUpdate(params.orderId, model, { useFindAndModify: false })
        .then((response) => {
            if (!response) {
                return callback("Order Update Failed");
            } else {
                if (params.status == "success") {
                    return callback(null, "Order Updated Successfully " + response);
                } else {
                    return callback(null, "Order Not Updated");
                }
            }
        })
        .catch((error) => {
            return callback(error);
        });
}

// async function getUserOrders(params, callback) {

//     console.log("Service Line 17 "+params);
//     order.find({ orderUser: params})
//     .populate({
//         path: 'orderProducts',
//         model: 'product',
//         populate: {
//             path: 'category',
//             model: 'category',
//             select: 'categoryName'
//         }
//     }).then((response) => {
//         return callback(null, response);
//     }).catch((error) => {
//         return callback(error);
//     });
// }

// async function getOrders(callback) {
//     order.find({})
//     .populate({
//         path: 'orderProducts',
//         model: 'product',
//         populate: {
//             path: 'category',
//             model: 'category',
//             select: 'categoryName'
//         }
//     }).then((response) => {
//         console.log("Service Line 195 "+response);
//         return callback(null, response);
//     }).catch((error) => {
//         console.log(error);
//         return callback(error);
//     });

// }


// const Order = require('../models/order.model');
// const dbConfig = require('../config/db.config');

// async function createOrder(params, callback) {

//     if (!params.orderNo) {
//         return callback({
//             message: "Order No Required"
//         }, "");
//     }
//     if (!params.orderProducts) {
//         return callback({
//             message: "Order Product Required"
//         }, "");
//     }

//     console.log("Service Line 17 "+params);

//     const model = Order(params);

//     model.save().then((response) => {
//         console.log("Line 22 "+response);
//         return callback(null, response);
//     }).catch((error) => {
//         console.log("Line 25 "+error);
//         return callback(error);
//     });
// }

async function getUserOrders(params, callback) {

    const orderUserID = params.orderUserID;

    var condition = {};

    if (orderUserID) {
        condition["orderUserID"] = orderUserID;

        find(condition, params, (error, response) => {
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

    const orderNo = params.orderNo;

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

    order.find(condition, "orderNo orderUser orderDate paymentMethod quantity total")
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
    updateOrder,
    getUserOrders,
    getOrders,
    createPOSOrderByCard
};
