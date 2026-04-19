const sequelize = require('./database');
const Category = require('./models/category');
const User = require('./models/user');
const Product = require('./models/product');

const categoriesData = [
    { id: 1, name: 'Son môi', slug: 'son-moi', product_count: 128, icon: 'bi-flower1' },
    { id: 11, name: 'Son lì', slug: 'son-li', parent_id: 1 },
    { id: 12, name: 'Son bóng', slug: 'son-bong', parent_id: 1 },
    { id: 2, name: 'Má hồng', slug: 'ma-hong', product_count: 64, icon: 'bi-palette' },
    { id: 3, name: 'Trang điểm mắt', slug: 'trang-diem-mat', product_count: 96, icon: 'bi-eye' },
    { id: 31, name: 'Phấn mắt', slug: 'phan-mat', parent_id: 3 },
    { id: 32, name: 'Kẻ mắt', slug: 'ke-mat', parent_id: 3 },
    { id: 4, name: 'Dưỡng da', slug: 'duong-da', product_count: 85, icon: 'bi-droplet' },
    { id: 5, name: 'Gift Set', slug: 'gift-set', product_count: 32, icon: 'bi-gift' },
];

const usersData = [
    {
        first_name: "Kiều",
        last_name: "Biên",
        email: "admin@blushbloom.vn",
        password: "admin123",
        role: "admin",
        phone: "0123456789"
    },
    {
        first_name: "Nguyễn",
        last_name: "Lan Anh",
        email: "lananh@email.com",
        password: "user123",
        role: "user",
        phone: "0987654321"
    }
];

const productsData = [
    {
        name: 'Lipstick Matte Ruby Woo',
        brand: 'MAC Cosmetics',
        slug: 'lipstick-matte-ruby-woo',
        price: 600000,
        price_sale: 480000,
        stock: 50,
        status: 'active',
        badge: 'sale',
        category_id: 11,
        description: 'Màu đỏ kinh điển của MAC'
    },
    {
        name: 'Rouge Dior Satin 999',
        brand: 'Dior Beauty',
        slug: 'rouge-dior-satin-999',
        price: 1250000,
        stock: 20,
        status: 'active',
        badge: 'new',
        category_id: 1,
        description: 'Quyến rũ và sang trọng'
    },
    {
        name: 'NARS Radiant Creamy Concealer',
        brand: 'NARS',
        slug: 'nars-radiant-creamy-concealer',
        price: 750000,
        stock: 35,
        status: 'active',
        category_id: 3,
        description: 'Che khuyết điểm số 1 thế giới'
    }
];

async function seed() {
    try {
        console.log("Bat dau seed dữ liệu...");
        await sequelize.authenticate();

        const OrderItem = require('./models/orderItem');
        const Order = require('./models/order');
        
        await OrderItem.destroy({ where: {} });
        await Order.destroy({ where: {} });
        await Product.destroy({ where: {} });
        await Category.destroy({ where: {} });
        await User.destroy({ where: {} });
        const bcrypt = require('bcryptjs');
        for (const user of usersData) {
            try { 
                const salt = await bcrypt.genSalt(10);
                const hashedUser = { ...user, password: await bcrypt.hash(user.password, salt) };
                await User.upsert(hashedUser); 
            } catch (e) {
                console.error("Error seeding user:", e);
            }
        }
        console.log("Đã tạo Users thành công.");

        for (const cat of categoriesData) {
            try { await Category.upsert(cat); } catch (e) {}
        }
        console.log("Đã tạo Categories thành công.");

        for (const prod of productsData) {
            await Product.create(prod);
        }
        console.log("Đã tạo Products thành công.");

        console.log("Hoàn thành seed!");
        process.exit();
    } catch (err) {
        console.error("Lỗi seed:", err);
        process.exit(1);
    }
}

seed();
