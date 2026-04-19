const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Category = require('./category');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Tên sản phẩm không được để trống' },
            notNull: { msg: 'Tên sản phẩm không được để trống' }
        }
    },
    brand: {
        type: DataTypes.STRING,
        allowNull: true
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: 'Đường dẫn (slug) đã tồn tại' },
        validate: {
            notEmpty: { msg: 'Slug không được để trống' },
            notNull: { msg: 'Slug không được để trống' }
        }
    },
    price: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        validate: {
            isDecimal: { msg: 'Giá sản phẩm phải là số' },
            min: { args: [0], msg: 'Giá sản phẩm không được âm' },
            notNull: { msg: 'Giá sản phẩm không được để trống' }
        }
    },
    price_sale: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        validate: {
            isDecimal: { msg: 'Giá sale phải là số' },
            min: { args: [0], msg: 'Giá sale không được âm' }
        }
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            isInt: { msg: 'Số lượng tồn kho phải là số nguyên' },
            min: { args: [0], msg: 'Số lượng không được âm' }
        }
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
    },
    image: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    },
    category_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Category,
            key: 'id'
        },
        validate: {
            notEmpty: { msg: 'Vui lòng chọn danh mục' }
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    badge: {
        type: DataTypes.STRING,
        allowNull: true
    },
    review_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'products',
    timestamps: true,
    underscored: true
});

Product.belongsTo(Category, { foreignKey: 'category_id' });
Category.hasMany(Product, { foreignKey: 'category_id' });

module.exports = Product;
