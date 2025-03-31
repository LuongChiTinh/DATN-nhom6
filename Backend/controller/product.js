const express = require('express');
const db = require('../models/db');
const router = express.Router();

router.get('/getAllProduct', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 16; // Mỗi trang 16 sản phẩm
    const offset = (page - 1) * limit;

    const sql = `SELECT * FROM product LIMIT ? OFFSET ?`;
    try {
        db.getItem(sql, [limit, offset], (err, result) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            const countSql = `SELECT COUNT(*) as total FROM product`;
            db.getItem(countSql, [], (err, countResult) => {
                if (err) return res.status(500).json({ error: 'Database error' });
                res.json({ products: result || [], total: countResult[0].total });
            });
        });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching products' });
    }
});

router.get('/getProduct/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid product ID' });

    const updateViewSql = `UPDATE product SET Views = COALESCE(Views, 0) + 1 WHERE Product_ID = ?`;
    const getProductSql = `SELECT * FROM product WHERE Product_ID = ?`;
    
    try {
        db.executeItem(updateViewSql, [id], (err) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            db.getItem(getProductSql, [id], (err, result) => {
                if (err) return res.status(500).json({ error: 'Database error' });
                res.json(result[0] || {});
            });
        });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching product' });
    }
});

router.post('/searchProduct', async (req, res) => {
    const { keyword } = req.body;
    if (!keyword) return res.status(400).json({ error: 'Keyword cannot be empty' });

    const sql = `SELECT * FROM product WHERE Name LIKE ? OR Author LIKE ?`;
    try {
        db.getItem(sql, [`%${keyword}%`, `%${keyword}%`], (err, result) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json(result || []);
        });
    } catch (err) {
        res.status(500).json({ error: 'Error searching products' });
    }
});

router.get('/newProduct', async (req, res) => {
    const sql = `SELECT * FROM product ORDER BY Publication_Date DESC LIMIT 10`;
    try {
        db.getItem(sql, [], (err, result) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json(result || []);
        });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching new products' });
    }
});

router.get('/hotProduct', async (req, res) => {
    const sql = `SELECT * FROM product ORDER BY COALESCE(Views, 0) DESC LIMIT 10`;
    try {
        db.getItem(sql, [], (err, result) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json(result || []);
        });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching hot products' });
    }
});

router.get('/randomProducts', async (req, res) => {
    const sql = `SELECT * FROM product ORDER BY RAND() LIMIT 10`;
    try {
        db.getItem(sql, [], (err, result) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json(result || []);
        });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching random products' });
    }
});

router.post('/productsByFilters', async (req, res) => {
    const { categoryId, sortBy, author } = req.body;
    const page = parseInt(req.body.page) || 1;
    const limit = 16;
    const offset = (page - 1) * limit;

    let sql = `SELECT * FROM product WHERE 1=1`;
    const params = [];

    if (categoryId) {
        sql += ` AND Category_ID = ?`;
        params.push(categoryId);
    }
    if (author) {
        sql += ` AND Author LIKE ?`;
        params.push(`%${author}%`);
    }

    if (sortBy === 'new') sql += ` ORDER BY Publication_Date DESC`;
    else if (sortBy === 'price-asc') sql += ` ORDER BY Price ASC`;
    else if (sortBy === 'price-desc') sql += ` ORDER BY Price DESC`;
    else if (sortBy === 'views') sql += ` ORDER BY COALESCE(Views, 0) DESC`;
    else if (sortBy === 'purchases') sql += ` ORDER BY COALESCE(Purchase_Count, 0) DESC`;

    sql += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    try {
        db.getItem(sql, params, (err, result) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            const countSql = `SELECT COUNT(*) as total FROM product WHERE 1=1 ${categoryId ? 'AND Category_ID = ?' : ''} ${author ? 'AND Author LIKE ?' : ''}`;
            const countParams = [];
            if (categoryId) countParams.push(categoryId);
            if (author) countParams.push(`%${author}%`);
            db.getItem(countSql, countParams, (err, countResult) => {
                if (err) return res.status(500).json({ error: 'Database error' });
                res.json({ products: result || [], total: countResult[0].total });
            });
        });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching filtered products' });
    }
});

module.exports = router;