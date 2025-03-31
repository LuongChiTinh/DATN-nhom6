const express = require('express');
const db = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const SECRET_KEY = 'tinh'; // Thay bằng key bí mật thực tế

router.post('/register', async (req, res) => {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password || !phone) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO user (Name, Email, Password, Phone) VALUES (?, ?, ?, ?)`;
        db.executeItem(sql, [name, email, hashedPassword, phone], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Email already exists' });
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ message: 'Registered successfully', userId: result.insertId });
        });
    } catch (err) {
        res.status(500).json({ error: 'Error during registration' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'All fields are required' });

    const sql = `SELECT * FROM user WHERE Email = ?`;
    try {
        db.getItem(sql, [email], async (err, result) => {
            if (err || !result.length) return res.status(401).json({ error: 'Invalid email or password' });
            const user = result[0];
            const match = await bcrypt.compare(password, user.Password);
            if (!match) return res.status(401).json({ error: 'Invalid email or password' });
            const token = jwt.sign({ id: user.User_ID, role: user.Role }, SECRET_KEY, { expiresIn: '1h' });
            res.json({ 
                message: 'Logged in successfully', 
                token,
                user: { id: user.User_ID, name: user.Name, email: user.Email, role: user.Role } 
            });
        });
    } catch (err) {
        res.status(500).json({ error: 'Error during login' });
    }
});

router.get('/getUser/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid user ID' });

    const sql = `SELECT User_ID, Name, Email, Phone, Role FROM user WHERE User_ID = ?`;
    try {
        db.getItem(sql, [id], (err, result) => {
            if (err || !result.length) return res.status(404).json({ error: 'User not found' });
            res.json(result[0]);
        });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching user info' });
    }
});

router.put('/updateUser/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, phone } = req.body;
    if (isNaN(id) || !name || !phone) {
        return res.status(400).json({ error: 'Invalid input data' });
    }

    const sql = `UPDATE user SET Name = ?, Phone = ? WHERE User_ID = ?`;
    try {
        db.executeItem(sql, [name, phone, id], (err) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ message: 'Updated successfully' });
        });
    } catch (err) {
        res.status(500).json({ error: 'Error updating user' });
    }
});

module.exports = router;