const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');
const { checkJWT, isAdmin } = require('../controllers/authCheck');

router.post('/orders/checkout', OrderController.create);
router.get('/orders/list', checkJWT, isAdmin, OrderController.list);
router.get('/orders/:id', checkJWT, OrderController.getById);
router.put('/orders/:id/status', checkJWT, isAdmin, OrderController.updateStatus);

module.exports = router;
