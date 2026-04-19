const Order = require('../models/order');
const OrderItem = require('../models/orderItem');
const Product = require('../models/product');
const sequelize = require('../database');

class OrderController {
    static async create(req, res) {
        const transaction = await sequelize.transaction();
        try {
            const { user_id, items, total_price, shipping_address, payment_method, customer_name, phone } = req.body;

            const order = await Order.create({
                user_id,
                total_price,
                shipping_address,
                payment_method,
                customer_name,
                phone
            }, { transaction });

            for (const item of items) {
                await OrderItem.create({
                    order_id: order.id,
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: item.price
                }, { transaction });

                const product = await Product.findByPk(item.product_id, { transaction });
                if (product) {
                    product.stock -= item.quantity;
                    await product.save({ transaction });
                }
            }

            await transaction.commit();
            res.status(201).json({ status: 201, message: 'Đặt hàng thành công', order_id: order.id });
        } catch (error) {
            await transaction.rollback();
            console.error('Error during checkout:', error);
            const message = error.errors ? error.errors.map(e => e.message).join(', ') : error.message;
            res.status(500).json({ error: message });
        }
    }

    static async list(req, res) {
        try {
            const orders = await Order.findAll({
                include: [{ model: OrderItem, include: [Product] }],
                order: [['created_at', 'DESC']]
            });
            res.status(200).json({ status: 200, data: orders });
        } catch (error) {
            console.error('Error fetching orders:', error);
            const message = error.errors ? error.errors.map(e => e.message).join(', ') : error.message;
            res.status(500).json({ error: message });
        }
    }

    static async getById(req, res) {
        try {
            const order = await Order.findByPk(req.params.id, {
                include: [{ model: OrderItem, include: [Product] }]
            });
            if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
            res.status(200).json({ status: 200, data: order });
        } catch (error) {
            console.error('Error fetching order by ID:', error);
            const message = error.errors ? error.errors.map(e => e.message).join(', ') : error.message;
            res.status(500).json({ error: message });
        }
    }

    static async updateStatus(req, res) {
        try {
            const { status } = req.body;
            const order = await Order.findByPk(req.params.id);
            if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

            const validTransitions = {
                'pending': ['shipping', 'done', 'cancelled'],
                'shipping': ['done', 'cancelled'],
                'done': [],
                'cancelled': []
            };

            if (!validTransitions[order.status] || !validTransitions[order.status].includes(status)) {
                return res.status(400).json({ message: 'Chuyển đổi trạng thái không hợp lệ!' });
            }

            order.status = status;
            await order.save();
            res.status(200).json({ status: 200, message: 'Cập nhật trạng thái thành công' });
        } catch (error) {
            console.error('Error updating order status:', error);
            const message = error.errors ? error.errors.map(e => e.message).join(', ') : error.message;
            res.status(500).json({ error: message });
        }
    }
}

module.exports = OrderController;
