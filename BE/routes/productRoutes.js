const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const { checkJWT, isAdmin } = require('../controllers/authCheck');

const multer = require('multer');
const path = require('path');

// Cấu hình lưu trữ cho multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/products/list', ProductController.list);
router.get('/products/:id', ProductController.getById);

router.post('/products/add', checkJWT, isAdmin, upload.single('image'), ProductController.create);
router.put('/products/:id', checkJWT, isAdmin, upload.single('image'), ProductController.update);
router.delete('/products/:id', checkJWT, isAdmin, ProductController.delete);

module.exports = router;
