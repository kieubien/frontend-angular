const sequelize = require('./database');
const Category = require('./models/category');
const User = require('./models/user');

async function check() {
    try {
        const cats = await Category.findAll({ raw: true });
        console.log('--- CATEGORIES IN DB ---');
        console.table(cats.map(c => ({ id: c.id, name: c.name, slug: c.slug })));

        const users = await User.findAll({ raw: true });
        console.log('\n--- USERS IN DB ---');
        console.table(users.map(u => ({ 
            id: u.id, 
            email: u.email, 
            phone: u.phone, // Thêm cột này
            role: u.role, 
            name: `${u.first_name} ${u.last_name}` 
        })));
        
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
check();
