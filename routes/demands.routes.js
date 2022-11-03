const express = require('express');
const router = express.Router();
const demandController = require('../controllers/demand.controller');

router.post('/demand', demandController.create);

router.get('/demand', demandController.find);

router.post('/demandUpdate', demandController.update);

router.delete('/demand/:id', demandController.delete);

module.exports = router;