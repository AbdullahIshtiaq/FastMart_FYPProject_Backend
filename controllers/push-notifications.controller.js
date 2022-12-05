var admin = require("firebase-admin");
var fcm = require("fcm-notification");
var user = require("../models/user.model");

var serviceAccount = require("../config/push_notification_key.json");
const certPath = admin.credential.cert(serviceAccount);

var FCM = new fcm(certPath);

exports.sendForAds = (req, res, next) => {

    try {

        user.find({ role: "customer" }).then((result) => {
            if (result.length > 0) {
                result.forEach((item) => {
                    if (item.fcmToken != null && item.fcmToken != undefined && item.fcmToken != "") {
                        let message = {
                            notification: {
                                title: req.body.advertismentTitle.toString(),
                                body: req.body.advertismentDesc.toString(),
                            },
                            data: {
                                notificationType: 'Ad',
                                advertismentTitle: req.body.advertismentTitle.toString(),
                                advertismentDesc: req.body.advertismentDesc.toString(),
                                advertismentType: req.body.advertismentType.toString(),
                                createdDateTime: req.body.createdDateTime.toString(),
                                advertismentAttachment: req.body.advertismentAttachment.toString(),
                            },
                            token: item.fcmToken,
                        };

                        FCM.send(message, function (err, response) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('Notification sent successfully.');
                            }
                        });
                    }
                });
                return res.status(200).send({
                    message: 'All Notifications sent successfully.'
                });
            }

        }).catch((err) => {
            console.log(err);
        });
    } catch (err) {
        throw err;
    }
};

exports.sendForOffers = (req, res, next) => {

    try {
        user.find({ role: "customer" }).then((result) => {
            if (result.length > 0) {
                result.forEach((item) => {
                    if (item.fcmToken != null && item.fcmToken != undefined && item.fcmToken != "") {
                        let message = {
                            notification: {
                                title: req.body.advertismentTitle.toString(),
                                body: req.body.advertismentDesc.toString(),
                            },
                            data: {
                                notificationType: 'Offer',
                                advertismentTitle: req.body.advertismentTitle.toString(),
                                advertismentDesc: req.body.advertismentDesc.toString(),
                                advertismentType: req.body.advertismentType.toString(),
                                createdDateTime: req.body.createdDateTime.toString(),
                                startDate: req.body.startDate.toString(),
                                endDate: req.body.endDate.toString(),
                                discount: req.body.discount.toString(),
                                categoryName: req.body.categoryName.toString(),
                            },
                            token: item.fcmToken,
                        };

                        FCM.send(message, function (err, response) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('Notification sent successfully.');
                            }
                        });
                    }
                });
                return res.status(200).send({
                    message: 'All Notifications sent successfully.'
                });
            }

        }).catch((err) => {
            console.log(err);
        });

    } catch (err) {
        throw err;
    }

};


exports.sendForOrder = (req, res, next) => {
    try {
        let message = {
            notification: {
                title: "Order Successfully Completed",
                body: "Thank you for shopping with us.",
            },
            data: {
                notificationType: 'Order',
                orderNo: req.body.orderNo.toString(),
                orderTotal: req.body.orderTotal.toString(),
                orderDate: req.body.orderDate.toString(),
                orderTime: req.body.orderTime.toString(),
                paymentMethod: req.body.paymentMethod.toString(),
                message: "Thank you for shopping with us.",
            },
            token: req.body.fcm_token,
        };

        FCM.send(message, function (err, response) {
            if (err) {
                return res.status(500).send({
                    message: err
                });
            } else {
                return res.status(200).send({
                    message: 'Notification sent successfully.'
                });
            }
        });

    } catch (err) {
        throw err;
    }

};

exports.sendForDemand = (req, res, next) => {
    console.log("In Demand Notification");
    try {
        console.log(req.body);
        let message = {
            notification: {
                title: "Demand Request Status",
                body: (req.body.demandProgress.toString() == "Accepted") ? "Your demand request has been approved."
                    : "Your demand request has been rejected.",
            },
            data: {
                notificationType: 'Demand',
                demandId: req.body.demandId.toString(),
                demandProgress: req.body.demandProgress.toString(),
                message: req.body.message.toString(),
                createdDateTime: req.body.createdDateTime.toString(),
                response: (req.body.demandProgress.toString() == "Accepted") ? "We are happpy to inform you that your demand request has been approved. We will act on it soon."
                    : "We are sorry to inform you that your demand request has been rejected. Please try again later.",
            },
            token: req.body.fcm_token,
        };

        console.log(message);

        FCM.send(message, function (err, response) {
            if (err) {
                return res.status(500).send({
                    message: err
                });
            } else {
                return res.status(200).send({
                    message: 'Notification sent successfully.'
                });
            }
        });

    } catch (err) {
        throw err;
    }

};

