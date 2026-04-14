const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET; 

class UserController {
    static async register(req, res) {
        try {
            const { first_name, last_name, email, phone, password, newsletter } = req.body;
            console.log(req.body);

            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: 'Email đã tồn tại!' });
            }

            const user = await User.create({ 
                first_name, 
                last_name, 
                email, 
                phone, 
                password, 
                newsletter: newsletter === undefined ? true : newsletter 
            });

            res.status(201).json({
                message: "Đăng ký thành công!",
                user: { 
                    id: user.id, 
                    first_name: user.first_name, 
                    last_name: user.last_name, 
                    email: user.email,
                    phone: user.phone
                }
            });

        } catch (error) {
            console.error('Error during registration:', error);
            const message = error.errors ? error.errors.map(e => e.message).join(', ') : error.message;
            res.status(500).json({ message: "Lỗi server", error: message });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(400).json({ message: "Email hoặc mật khẩu không chính xác!" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Email hoặc mật khẩu không chính xác!" });
            }

            const token = jwt.sign({ 
                id: user.id, 
                first_name: user.first_name, 
                last_name: user.last_name, 
                email: user.email, 
                role: user.role 
            }, JWT_SECRET, { expiresIn: "1h" });
            return res.status(200).json({
                message: "Đăng nhập thành công!",
                token
            });

        } catch (error) {
            console.error("Lỗi login:", error);
            const message = error.errors ? error.errors.map(e => e.message).join(', ') : error.message;
            return res.status(500).json({ message: "Lỗi server, vui lòng thử lại!", error: message });
        }
    }
}

module.exports = UserController;
