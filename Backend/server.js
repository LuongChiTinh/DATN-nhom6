const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const product = require('./controller/product');
const category = require('./controller/categories');
const user = require('./controller/user');
const cart = require('./controller/cart');
const order = require('./controller/order');
const wishlist = require('./controller/wishlist');

const app = express();
const port = process.env.PORT || 5000;
const SECRET_KEY = 'tinh'; // Thay bằng key bí mật thực tế

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware kiểm tra đăng nhập bằng JWT
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

app.use('/api/product', product);
app.use('/api/categories', category);
app.use('/api/user', user);
app.use('/api/cart', authenticateUser, cart);
app.use('/api/order', authenticateUser, order);
app.use('/api/wishlist', authenticateUser, wishlist);

app.get('/', (req, res) => res.send('Welcome to the Bookstore API!'));

app.use((req, res, next) => {
    res.status(404).json({ error: 'Không tìm thấy tuyến đường' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});