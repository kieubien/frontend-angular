const sequelize = require('./database');
const Category = require('./models/category');
const User = require('./models/user');

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
        password: "admin123", // Sẽ được mã hóa tự động bằng hooks beforeCreate
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

async function seed() {
    try {
        console.log("Bat dau seed dữ liệu...");
        await sequelize.authenticate();

        // Xóa sạch bảng Category / User để tránh lặp id khi seed nhiều lần
        await Category.destroy({ where: {} });
        await User.destroy({ where: {} });

        for (const user of usersData) {
            await User.create(user);
        }
        console.log("Đã tạo Users thành công.");

        for (const cat of categoriesData) {
            await Category.create(cat);
        }
        console.log("Đã tạo Categories thành công.");

        console.log("Hoàn thành seed!");
        process.exit();
    } catch (err) {
        console.error("Lỗi seed:", err);
        process.exit(1);
    }
}

seed();
