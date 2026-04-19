const CategoryModel = require('../models/category');
const ProductModel = require('../models/product');

class CategoryController {

    static async get(req, res) {
        try {
            const categories = await CategoryModel.findAll();

            const categoryData = [];
            for (let category of categories) {
                const productCount = await ProductModel.count({ where: { category_id: category.id } });
                const catData = category.toJSON();
                catData.product_count = productCount;
                categoryData.push(catData);
            }

            res.status(200).json({
                "status": 200,
                "message": "Lấy danh sách thành công",
                "data": categoryData,  
            });
        } catch (error) {
            console.error('Error fetching categories:', error);
            const message = error.errors ? error.errors.map(e => e.message).join(', ') : error.message;
            res.status(500).json({ error: message });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const category = await CategoryModel.findByPk(id);

            if (!category) {
                return res.status(404).json({ message: "Id không tồn tại" });
            }

            res.status(200).json({
                "status": 200,
                "data": category
            });
        } catch (error) {
            console.error('Error fetching category by ID:', error);
            const message = error.errors ? error.errors.map(e => e.message).join(', ') : error.message;
            res.status(500).json({ error: message });
        }
    }

    static async getBySlug(req, res) {
        try {
            const { slug } = req.params;
            const category = await CategoryModel.findOne({ where: { slug } });

            if (!category) {
                return res.status(404).json({ message: "Slug không tồn tại" });
            }

            res.status(200).json({
                "status": 200,
                "data": category
            });
        } catch (error) {
            console.error('Error fetching category by slug:', error);
            const message = error.errors ? error.errors.map(e => e.message).join(', ') : error.message;
            res.status(500).json({ error: message });
        }
    }

    static async create(req, res) {
        try {
            const { name, slug, icon, description, product_count } = req.body;
            const category = await CategoryModel.create({ name, slug, icon, description, product_count });

            res.status(201).json({
                message: "Thêm mới thành công",
                category
            });
        } catch (error) {
            console.error('Error creating category:', error);
            const message = error.errors ? error.errors.map(e => e.message).join(', ') : error.message;
            res.status(500).json({ error: message });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { name, slug, icon, description, product_count } = req.body;

            const category = await CategoryModel.findByPk(id);
            if (!category) {
                return res.status(404).json({ message: "Id không tồn tại" });
            }

            category.name = name;
            category.slug = slug;
            if (icon !== undefined) category.icon = icon;
            category.description = description;
            if (product_count !== undefined) category.product_count = product_count;

            await category.save();

            res.status(200).json({
                message: "Cập nhật thành công",
                category
            });
        } catch (error) {
            console.error('Error updating category:', error);
            const message = error.errors ? error.errors.map(e => e.message).join(', ') : error.message;
            res.status(500).json({ error: message });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;

            const category = await CategoryModel.findByPk(id);
            if (!category) {
                return res.status(404).json({ message: "Id không tồn tại" });
            }

            const productCount = await ProductModel.count({ where: { category_id: id } });
            if (productCount > 0) {
                return res.status(400).json({ 
                    message: `Không thể xóa danh mục này vì vẫn còn ${productCount} sản phẩm bên trong. Vui lòng xóa hoặc di chuyển sản phẩm trước!` 
                });
            }

            await category.destroy();

            res.status(200).json({ message: "Xóa thành công" });
        } catch (error) {
            console.error('Error deleting category:', error);

            if (error.name === 'SequelizeForeignKeyConstraintError') {
                return res.status(400).json({ message: "Không thể xóa do ràng buộc dữ liệu với sản phẩm." });
            }
            const message = error.errors ? error.errors.map(e => e.message).join(', ') : error.message;
            res.status(500).json({ error: message });
        }
    }
}

module.exports = CategoryController;
