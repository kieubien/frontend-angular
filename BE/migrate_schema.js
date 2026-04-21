const sequelize = require('./database');
const { DataTypes } = require('sequelize');

async function migrate() {
    const queryInterface = sequelize.getQueryInterface();
    
    // Helper function to slugify names
    const slugify = (text) => {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
    };

    try {
        console.log('--- Starting Migration ---');

        // 1. Update Categories Table
        console.log('Migrating Categories Table...');
        const catTable = await queryInterface.describeTable('categories');
        
        if (!catTable.slug) {
            await queryInterface.addColumn('categories', 'slug', { type: DataTypes.STRING, allowNull: true });
            console.log('Added slug column to categories');
        }
        
        if (!catTable.parent_id) {
            await queryInterface.addColumn('categories', 'parent_id', { type: DataTypes.INTEGER, allowNull: true });
            console.log('Added parent_id column to categories');
        }

        // Populate slugs for categories
        const [categories] = await sequelize.query('SELECT id, name FROM categories');
        for (const cat of categories) {
            const slug = `${slugify(cat.name)}-${cat.id}`; // Add ID to ensure uniqueness easily
            await sequelize.query('UPDATE categories SET slug = ? WHERE id = ?', { replacements: [slug, cat.id] });
        }
        console.log('Populated category slugs');

        // Now set slug to NOT NULL and UNIQUE
        await queryInterface.changeColumn('categories', 'slug', {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        });
        console.log('Updated categories.slug to NOT NULL and UNIQUE');


        // 2. Update Products Table
        console.log('Migrating Products Table...');
        const prodTable = await queryInterface.describeTable('products');

        if (!prodTable.slug) {
            await queryInterface.addColumn('products', 'slug', { type: DataTypes.STRING, allowNull: true });
            console.log('Added slug column to products');
        }

        if (!prodTable.original_price) {
            await queryInterface.addColumn('products', 'original_price', { type: DataTypes.DECIMAL(15, 2), allowNull: true });
            console.log('Added original_price column to products');
        }

        // Populate slugs for products
        const [products] = await sequelize.query('SELECT id, name FROM products');
        for (const prod of products) {
            const slug = `${slugify(prod.name)}-${prod.id}`;
            await sequelize.query('UPDATE products SET slug = ? WHERE id = ?', { replacements: [slug, prod.id] });
        }
        console.log('Populated product slugs');

        // Migrate data from price_sale if applicable
        if (prodTable.price_sale) {
            await sequelize.query('UPDATE products SET original_price = price_sale WHERE original_price IS NULL');
            console.log('Migrated price_sale data to original_price');
            // Optionally drop price_sale if you want to be clean, but let's keep it safe for now.
        }

        // Now set slug to NOT NULL and UNIQUE
        await queryInterface.changeColumn('products', 'slug', {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        });
        console.log('Updated products.slug to NOT NULL and UNIQUE');

        console.log('--- Migration Finished Successfully ---');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await sequelize.close();
    }
}

migrate();
