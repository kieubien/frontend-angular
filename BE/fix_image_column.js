const sequelize = require('./database');
const Product = require('./models/product');

async function fix() {
    try {
        console.log('--- Đang cập nhật cấu trúc bảng ---');
        // Sử dụng query trực tiếp để thay đổi cột
        await sequelize.query('ALTER TABLE products MODIFY image LONGTEXT');
        console.log('✅ Đã chuyển cột image sang LONGTEXT');

        console.log('--- Đang cập nhật dữ liệu mẫu ---');
        const sampleImages = [
            'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?q=80&w=1000&auto=format&fit=crop', // Lipstick
            'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=1000&auto=format&fit=crop', // Skincare
            'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop', // Makeup
            'https://images.unsplash.com/photo-1512496011951-a09e8d54499e?q=80&w=1000&auto=format&fit=crop'  // Perfume
        ];

        const products = await Product.findAll();
        for (let i = 0; i < products.length; i++) {
            if (!products[i].image || products[i].image.length < 10) {
                const img = sampleImages[i % sampleImages.length];
                await products[i].update({ image: img });
                console.log(`Updated image for product: ${products[i].name}`);
            }
        }

        console.log('🚀 Hoàn tất cập nhật!');
        process.exit(0);
    } catch (e) {
        console.error('❌ Lỗi:', e);
        process.exit(1);
    }
}

fix();
