const CategoryModel = require('./models/category');
const ProductModel = require('./models/product');
const sequelize = require('./database');

async function test() {
    try {
        console.log('Testing database connection...');
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        console.log('Fetching categories...');
        const categories = await CategoryModel.findAll();
        console.log('Categories found:', categories.length);

        console.log('Fetching products...');
        const products = await ProductModel.findAll({
            include: [{ model: CategoryModel }]
        });
        console.log('Products found:', products.length);

    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        await sequelize.close();
    }
}

test();
