const express = require('express');
const router = express.Router();
const salesController = require('../controllers/sales.controller');

router.get('/getDailySales', salesController.findDaily);

router.get('/getWeeklySales', salesController.findWeekly);

router.get('/getMonthlySales', salesController.findMonthly);

module.exports = router;