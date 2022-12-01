const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');

router.get('/getDailyReport', reportController.findDaily);

router.get('/getWeeklyReport', reportController.findWeekly);

router.get('/getMonthlyReport', reportController.findMonthly);

router.get('/getCustomerReport', reportController.findCustomerReport);

module.exports = router;