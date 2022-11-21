const pushNotification = require('../controllers/push-notifications.controller');
const express = require('express');
const router = express.Router();

router.post('/sendNotification', pushNotification.sendPushNotification);

module.exports = router;