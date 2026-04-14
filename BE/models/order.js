const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./user');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    total_price: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'shipping', 'done', 'cancelled'),
        defaultValue: 'pending'
    },
    payment_method: {
        type: DataTypes.STRING,
        defaultValue: 'COD'
    },
    shipping_address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    customer_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'orders',
    timestamps: true,
    underscored: true
});

Order.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Order, { foreignKey: 'user_id' });

module.exports = Order;
