const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const { checkJWT, isAdmin } = require('../controllers/authCheck');

router.get('/products/list', ProductController.list);
router.get('/products/:id', ProductController.getById);

router.post('/products/add', checkJWT, isAdmin, ProductController.create);
router.put('/products/:id', checkJWT, isAdmin, ProductController.update);
router.delete('/products/:id', checkJWT, isAdmin, ProductController.delete);

module.exports = router;
