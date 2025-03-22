const express = require('express');
const db = require('../models/db');
const app = express.Router();

// Lấy tất cả sản phẩm
app.get('/getAllProduct', (req, res) => {
    const sql = 'SELECT * FROM product';
    db.getItem(sql, function (err, resultQuery) {
        if (err) {
            console.error('Lỗi truy vấn MySQL:', err);
            return res.status(500).json({ error: 'Lỗi server' });
        } else {
            res.json(resultQuery)
        }
    });
});

// Lấy 1 sản phẩm hoặc sản phẩm chi tiết theo id
app.get('/getProduct/:id', (req, res) => {
    const id = req.params.id
    const sql = `SELECT * FROM product WHERE Product_ID = ${id}`;
    db.getItem(sql, function (err, resultQuery) {
        if (err) {
            console.error('Lỗi truy vấn MySQL:', err);
            return res.status(500).json({ error: 'Lỗi server' });
        } else {
            res.json(resultQuery)
        }
    })
})


// Tìm kiếm sản phẩm theo tên hoặc tác giả
app.post('/searchProduct', (req, res) => {
    const keyword = req.body.keyword;
    const sql = `SELECT * FROM product WHERE Name LIKE '%${keyword}%' OR Author LIKE '%${keyword}%'`;
    db.getItem(sql, function (err, resultQuery) {
        if (err) {
            console.error('Lỗi truy vấn MySQL:', err);
            return res.status(500).json({ error: 'Lỗi server' });
        } else {
            res.json(resultQuery)
        }
    })
});

// Top 10 sản phẩm mới nhất theo ngày xuất bản
app.get('/newProduct', (req, res) => {
    const sql = `SELECT * FROM product ORDER BY Publication_Date DESC LIMIT 10`;
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