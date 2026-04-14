process.chdir(__dirname); const sequelize=require('./database'); const Category=require('./models/category'); sequelize.sync({alter: true}).then(() => console.log('OK')).catch(console.log);
