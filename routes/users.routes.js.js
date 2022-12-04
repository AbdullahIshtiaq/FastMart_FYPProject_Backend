const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller');

router.post('/register', userController.register);

router.post('/login', userController.login);

router.post('/tokenUpdate', userController.updateToken);

router.get('/user-profile', userController.userProfile);

router.get('/getUsers', userController.getAll);

router.post('/updateProfile', userController.updateProfile);

router.post('/updateProfileImg', userController.updateProfileImage);

router.post('/changePassword', userController.changePassword);

module.exports = router;