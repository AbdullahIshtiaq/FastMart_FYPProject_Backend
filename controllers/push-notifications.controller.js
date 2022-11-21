var admin = require("firebase-admin");
var fcm = require("fcm-notification");

var serviceAccount = require("../config/push-notification-Key.json");
const certPath = admin.credential.cert(serviceAccount);

var FCM = new fcm(certPath);

exports.sendPushNotification = (req, res, next) => {

    try {
        let message = {
            notification: {
                title: 'Test Notification',
                body: 'This is a test notification',
            },
            data: {
                orderId: '123456',
                orderStatus: 'pending',
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
