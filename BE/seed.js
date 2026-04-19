const sequelize = require('./database');
const Category = require('./models/category');
const User = require('./models/user');
const Product = require('./models/product');

const categoriesData = [
    { id: 1, name: 'Son môi', slug: 'son-moi', product_count: 128, icon: 'bi-flower1' },
    { id: 2, name: 'Má hồng', slug: 'ma-hong', product_count: 64, icon: 'bi-palette' },
    { id: 3, name: 'Trang điểm mắt', slug: 'trang-diem-mat', product_count: 96, icon: 'bi-eye' },
    { id: 4, name: 'Dưỡng da', slug: 'duong-da', product_count: 85, icon: 'bi-droplet' },
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
        category_id: 1,
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
    },
    {
        name: 'Tom Ford Lip Color Matte',
        brand: 'Tom Ford',
        slug: 'tom-ford-lip-color-matte',
        price: 1350000,
        stock: 15,
        status: 'active',
        badge: 'hot',
        category_id: 1,
        description: 'Son lì cao cấp với độ bám màu tuyệt đỉnh'
    },
    {
        name: 'Chanel Les Beiges Blush',
        brand: 'Chanel',
        slug: 'chanel-les-beiges-blush',
        price: 1450000,
        price_sale: 1250000,
        stock: 10,
        status: 'active',
        badge: 'sale',
        category_id: 2,
        description: 'Má hồng tự nhiên mang lại vẻ rạng rỡ'
    },
    {
        name: 'Estee Lauder Advanced Night Repair',
        brand: 'Estee Lauder',
        slug: 'estee-lauder-advanced-night-repair',
        price: 2500000,
        stock: 25,
        status: 'active',
        badge: 'hot',
        category_id: 4,
        description: 'Serum phục hồi da chống lão hóa hàng đầu'
    },
    {
        name: 'YSL Water Stain Lip Gloss',
        brand: 'YSL',
        slug: 'ysl-water-stain-lip-gloss',
        price: 950000,
        price_sale: 850000,
        stock: 40,
        status: 'active',
        badge: 'sale',
        category_id: 1,
        description: 'Son bóng mỏng nhẹ với độ dưỡng cực cao'
    },
    {
        name: 'Urban Decay Naked Heat Palette',
        brand: 'Urban Decay',
        slug: 'urban-decay-naked-heat-palette',
        price: 1650000,
        stock: 5,
        status: 'active',
        category_id: 3,
        description: 'Bảng phấn mắt với những tông màu ấm cực cháy'
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
