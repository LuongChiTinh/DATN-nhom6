const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'tinh'; // Lấy từ .env, fallback là 'tinh' nếu không có

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Vui lòng đăng nhập' });
    }
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token không hợp lệ' });
    }
};

const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ error: 'Chỉ Admin mới có quyền truy cập' });
    }
    next();
};

module.exports = { authenticateUser, requireAdmin };