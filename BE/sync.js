process.chdir(__dirname); 
const sequelize = require('./database'); 
const Category = require('./models/category'); 
const User = require('./models/user'); 
const Product = require('./models/product'); 
const Order = require('./models/order'); 
const OrderItem = require('./models/orderItem'); 

async function syncDB() {
  try {
    console.log('Đang kết nối và đồng bộ cấu trúc bảng lên Hosting...');
    // Đồng bộ toàn bộ các bảng
    await sequelize.sync({ alter: true });
    console.log('Đã đồng bộ cấu trúc bảng thành công!');
    process.exit();
  } catch (err) {
    console.error('Lỗi đồng bộ:', err);
    process.exit(1);
  }
}

syncDB();
