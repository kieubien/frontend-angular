const CategoryModel = require('../models/category');

class CategoryController {

    static async get(req, res) {
        try {
            const categories = await CategoryModel.findAll();
            res.status(200).json({
                "status": 200,
                "message": "Lấy danh sách thành công",
                "data": categories,  
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
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
            res.status(500).json({ error: error.message });
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
            res.status(500).json({ error: error.message });
        }
    }

    static async create(req, res) {
        try {
            const { name, slug, parent_id, icon, description, product_count } = req.body;
            const category = await CategoryModel.create({ name, slug, parent_id, icon, description, product_count });

            res.status(201).json({
                message: "Thêm mới thành công",
                category
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { name, slug, parent_id, icon, description, product_count } = req.body;

            const category = await CategoryModel.findByPk(id);
            if (!category) {
                return res.status(404).json({ message: "Id không tồn tại" });
            }

            category.name = name;
            category.slug = slug;
            if (parent_id !== undefined) category.parent_id = parent_id;
            if (icon !== undefined) category.icon = icon;
            category.description = description;
            if (product_count !== undefined) category.product_count = product_count;

            await category.save();

            res.status(200).json({
                message: "Cập nhật thành công",
                category
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;

            const category = await CategoryModel.findByPk(id);
            if (!category) {
                return res.status(404).json({ message: "Id không tồn tại" });
            }

            await category.destroy();

            res.status(200).json({ message: "Xóa thành công" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = CategoryController;
