const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller');

router.post('/register', userController.register);

router.post('/login', userController.login);

router.post('/tokenUpdate', userController.updateToken);

router.get('/user-profile', userController.userProfile);

module.exports = router;