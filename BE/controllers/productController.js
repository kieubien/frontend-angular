const ProductModel = require('../models/product');
const CategoryModel = require('../models/category');
const OrderItemModel = require('../models/orderItem');

class ProductController {
    static async list(req, res) {
        try {
            const { category, brand, min_price, max_price, sort } = req.query;
            let whereClause = {};

            if (category) {
                const cat = await CategoryModel.findOne({ where: { slug: category } });
                if (cat) {
                    whereClause.category_id = cat.id;
                }
            }

            if (brand) {
                whereClause.brand = brand;
            }

            const products = await ProductModel.findAll({
                where: whereClause,
                include: [{ model: CategoryModel }]
            });

            res.status(200).json({
                status: 200,
                data: products
            });
        } catch (error) {
            console.error('Error fetching products:', error);
            const message = error.errors ? error.errors.map(e => e.message).join(', ') : error.message;
            res.status(500).json({ error: message });
        }
    }

    static async getById(req, res) {
        try {
            const product = await ProductModel.findByPk(req.params.id, {
                include: [{ model: CategoryModel }]
            });
            if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
            res.status(200).json({ status: 200, data: product });
        } catch (error) {
            console.error('Error fetching product by ID:', error);
            const message = error.errors ? error.errors.map(e => e.message).join(', ') : error.message;
            res.status(500).json({ error: message });
        }
    }
    static async create(req, res) {
        try {
            const { name, brand, slug, price, price_sale, stock, status, category_id, description, badge } = req.body;
            let data = { name, brand, slug, price, price_sale, stock, status, category_id, description, badge };
            
            Object.keys(data).forEach(key => {
                if (data[key] === undefined) {
                    delete data[key];
                }
                if (data[key] === 'null') {
                    data[key] = null;
                }
            });
            if (req.file) {
                data.image = `http://localhost:3000/uploads/${req.file.filename}`;
            }
            const product = await ProductModel.create(data);
            res.status(201).json({ status: 201, message: 'Thêm sản phẩm thành công', data: product });
        } catch (error) {
            console.error('Error creating product:', error);
            const message = error.errors ? error.errors.map(e => e.message).join(', ') : error.message;
            res.status(500).json({ error: message });
        }
    }

    static async update(req, res) {
        try {
            const product = await ProductModel.findByPk(req.params.id);
            if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
            
            const { name, brand, slug, price, price_sale, stock, status, category_id, description, badge } = req.body;
            let data = { name, brand, slug, price, price_sale, stock, status, category_id, description, badge };
            
            Object.keys(data).forEach(key => {
                if (data[key] === undefined) {
                    delete data[key];
                }
                if (data[key] === 'null') {
                    data[key] = null;
                }
            });

            if (req.file) {
                data.image = `http://localhost:3000/uploads/${req.file.filename}`;
            }
            
            await product.update(data);
            res.status(200).json({ status: 200, message: 'Cập nhật thành công', data: product });
        } catch (error) {
            console.error('Error updating product:', error);
            const message = error.errors ? error.errors.map(e => e.message).join(', ') : error.message;
            res.status(500).json({ error: message });
        }
    }

    static async delete(req, res) {
        try {
            const product = await ProductModel.findByPk(req.params.id);
            if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

            await OrderItemModel.destroy({ where: { product_id: product.id } });

            await product.destroy();
            res.status(200).json({ status: 200, message: 'Xoá thành công' });
        } catch (error) {
            console.error('Error deleting product:', error);
            const message = error.errors ? error.errors.map(e => e.message).join(', ') : error.message;
            res.status(500).json({ error: message });
        }
    }
}

module.exports = ProductController;
