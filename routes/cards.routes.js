const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cards.controller');

// router.post('/card', cardController.create);

router.get('/userCards', cardController.findOfUser);

module.exports = router;