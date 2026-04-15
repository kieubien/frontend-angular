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

            // Xử lý lọc giá (ví dụ)
            // if (min_price || max_price) { ... }

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
            const product = await ProductModel.create(req.body);
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
            await product.update(req.body);
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

            // Xoá sản phẩm trong các đơn hàng trước (cascade delete thủ công) để tránh lỗi khoá ngoại
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
