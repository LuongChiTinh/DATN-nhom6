const express = require('express');
const db = require('../models/db');
const app = express.Router();

// Lấy tất cả danh mục
app.get('/getAllCategories', (req, res) => {
    const sql = 'SELECT * FROM category';
    db.getItem(sql, function (err, resultQuery) {
        if (err) {
            console.error('Lỗi truy vấn MySQL:', err);
            return res.status(500).json({ error: 'Lỗi server' });
        } else {
            res.json(resultQuery)
        }
    });
});

// Lấy 1 danh mục theo id
app.get('/getCategories/:id', (req, res) => {
    const id = req.params.id
    const sql = `SELECT * FROM category WHERE Category_ID = ${id}`;
    db.getItem(sql, function (err, resultQuery) {
        if (err) {
            console.error('Lỗi truy vấn MySQL:', err);
            return res.status(500).json({ error: 'Lỗi server' });
        } else {
            res.json(resultQuery)
        }
    })
})


module.exports = app;