var admin = require("firebase-admin");
var fcm = require("fcm-notification");

var serviceAccount = require("../config/push-notification-Key.json");
const certPath = admin.credential.cert(serviceAccount);

var FCM = new fcm(certPath);

exports.sendForAds = (req, res, next) => {

    try {
        let message = {
            notification: {
                title: req.body.advertismentTitle,
                body: req.body.advertismentDesc,
            },
            data: {
                notificationType: 'Ad',
                advertismentTitle: req.body.advertismentTitle,
                advertismentDesc: req.body.advertismentDesc,
                advertismentType: req.body.advertismentType,
                createdDateTime: req.body.createdDateTime,
                advertismentAttachment: req.body.advertismentAttachment,
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

exports.sendForOffers = (req, res, next) => {

    try {
        let message = {
            notification: {
                title: req.body.advertismentTitle,
                body: req.body.advertismentDesc,
            },
            data: {
                notificationType: 'Offer',
                advertismentTitle: req.body.advertismentTitle,
                advertismentDesc: req.body.advertismentDesc,
                advertismentType: req.body.advertismentType,
                createdDateTime: req.body.createdDateTime,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                discount: req.body.discount,
                categoryName: req.body.categoryName,
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


exports.sendForOrder = (req, res, next) => {
    try {
        let message = {
            notification: {
                title: "Order Successfully Completed",
                body: "Thank you for shopping with us.",
            },
            data: {
                notificationType: 'Order',
                orderNo: req.body.orderNo,
                orderTotal: req.body.orderTotal,
                orderDate: req.body.orderDate,
                orderTime: req.body.orderTime,
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
        let message = {
            notification: {
                title: "Demand Request Status",
                body: (req.body.demandProgess == 'Accepted') ? "Your demand request has been approved."
                    : "Your demand request has been rejected.",
            },
            data: {
                notificationType: 'Demand',
                demandId: req.body.demandId,
                demandProgress: req.body.demandProgress,
                message: req.body.message,
                createdDateTime: req.body.createdDateTime,
                response: (req.body.demandProgess == 'Accepted') ? "We are happpy to inform you that your demand request has been approved. We will act on it soon."
                    : "We are sorry to inform you that your demand request has been rejected. Please try again later.",
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

