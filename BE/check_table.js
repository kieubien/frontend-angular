const sequelize = require('./database');
sequelize.query('DESCRIBE products;').then(([results]) => {
    console.log(results);
    process.exit();
}).catch(console.error);
