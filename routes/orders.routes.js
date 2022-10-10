const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orders.controller');

router.post('/order', orderController.create);

router.post('/posOrder', orderController.createPOSOrder);

router.get('/userOrders', orderController.findOfUser);

router.get('/order', orderController.findAll);

router.post('/orderUpdate', orderController.update);

// router.get('/order/:id', orderController.findOne);

// router.post('/order/:id', orderController.update);

// router.delete('/order/:id',orderController.delete);

module.exports = router;