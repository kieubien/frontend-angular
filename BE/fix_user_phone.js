const User = require('./models/user');

async function fix() {
    try {
        const user = await User.findByPk(16);
        if (user) {
            user.phone = '0901234567'; // SĐT tạm thời
            await user.save();
            console.log('Fixed user 16 phone number.');
        } else {
            console.log('User 16 not found.');
        }
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
fix();
