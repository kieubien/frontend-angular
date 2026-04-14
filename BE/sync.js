process.chdir(__dirname); 
const sequelize = require('./database'); 
const Category = require('./models/category'); 
const User = require('./models/user'); 

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Đã đồng bộ cấu trúc bảng thành công!');
    process.exit();
  })
  .catch((err) => {
    console.error('Lỗi đồng bộ:', err);
    process.exit(1);
  });
