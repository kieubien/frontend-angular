const sequelize = require('./database');
const Product = require('./models/product');

async function checkProducts() {
    try {
        const products = await Product.findAll({ raw: true, limit: 10 });
        console.log('--- PRODUCTS IN DB ---');
        console.table(products.map(p => ({ 
            id: p.id, 
            name: p.name, 
            image: p.image 
        })));
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
checkProducts();
