const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'BE', '.env') });
const sequelize = require('./BE/database');
const Category = require('./BE/models/category');

async function check() {
    try {
        const cats = await Category.findAll({ raw: true });
        console.log('--- CATEGORIES IN DB ---');
        console.table(cats);
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
check();
