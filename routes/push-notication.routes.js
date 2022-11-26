const pushNotification = require('../controllers/push-notifications.controller');
const express = require('express');
const router = express.Router();

router.post('/forAds', pushNotification.sendForAds);

router.post('/forOffers', pushNotification.sendForOffers);

router.post('/forOrder', pushNotification.sendForOrder);

router.post('/forDemand', pushNotification.sendForDemand);

module.exports = router;