const express = require('express');
const UserController = require('../controllers/userController');

const router = express.Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/list', UserController.getAllUsers);
router.put('/update-role/:id', UserController.updateRole);
router.put('/update-status/:id', UserController.updateStatus);

module.exports = router;
