const express = require('express');
const compression = require('compression');
const cors = require("cors");
const b = require('buffer');
b.SlowBuffer = Buffer;
const app = express();

const port = 3000;
const categoryRoutes = require("./routes/categoryRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors({
    origin: "*",
    methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    allowedHeaders: "Content-Type, Authorization"
}));

app.use(categoryRoutes);
app.use('/users', userRoutes);
app.use(productRoutes);
app.use(orderRoutes);

// Phục vụ ảnh từ thư mục public/uploads
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.listen(port, () => {
    console.log('running http://localhost:3000');
})