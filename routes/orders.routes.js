const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orders.controller');

router.post('/order', orderController.create);

router.get('/orderOfUser', orderController.findAllOfUser);

router.get('/orderAll', orderController.findAll);

// router.get('/order/:id', orderController.findOne);

// router.post('/order/:id', orderController.update);

// router.delete('/order/:id',orderController.delete);

module.exports = router;