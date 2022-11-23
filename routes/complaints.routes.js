const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaint.controller');

router.post('/complaint', complaintController.create);

router.get('/complaint', complaintController.find);

module.exports = router;