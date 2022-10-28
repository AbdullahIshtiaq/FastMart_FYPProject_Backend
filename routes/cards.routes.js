const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cards.controller');

router.get('/userCards', cardController.findOfUser);

router.post('/createCard', cardController.create);

router.delete('/deleteCard', cardController.delete);

module.exports = router;