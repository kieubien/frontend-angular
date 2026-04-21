const sequelize = require('./database');

async function checkAllTables() {
    try {
        const tables = ['categories', 'products', 'users', 'orders', 'order_items'];
        for (const table of tables) {
            console.log(`\n--- ${table} Table ---`);
            try {
                const [cols] = await sequelize.query(`SHOW COLUMNS FROM ${table}`);
                console.log(cols.map(c => c.Field));
            } catch (e) {
                console.log(`${table} table does not exist or error:`, e.message);
            }
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

checkAllTables();
