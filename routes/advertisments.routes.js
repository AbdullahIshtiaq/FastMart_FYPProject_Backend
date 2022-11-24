const express = require('express');
const router = express.Router();
const advertismentController = require('../controllers/advertisment.controller');

router.post('/advertisment', advertismentController.create);

router.get('/ads', advertismentController.findAds);

router.get('/offers', advertismentController.findOffers);

router.get('/activeOffers', advertismentController.findActiveOffers);

module.exports = router;