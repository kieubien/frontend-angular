const Product = require('../models/product');
const User = require('../models/user');
const sequelize = require('../database');

class StatsController {
    static async getPublicStats(req, res) {
        try {
            const productCount = await Product.count({ where: { status: 'active' } });
            const userCount = await User.count({ where: { role: 'user' } });
            
            // Đếm số lượng brand duy nhất
            const brandCount = await Product.count({
                distinct: true,
                col: 'brand'
            });

            res.status(200).json({
                status: 200,
                data: {
                    products: productCount,
                    customers: userCount,
                    brands: brandCount
                }
            });
        } catch (error) {
            console.error('Error fetching public stats:', error);
            res.status(500).json({ message: 'Lỗi server', error: error.message });
        }
    }
}

module.exports = StatsController;
