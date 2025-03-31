const express = require('express');
const db = require('../models/db');
const router = express.Router();

router.get('/getAllCategories', async (req, res) => {
    const sql = 'SELECT * FROM category';
    try {
        db.getItem(sql, [], (err, result) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json(result || []);
        });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching categories' });
    }
});

router.get('/getCategories/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid category ID' });

    const sql = `SELECT * FROM category WHERE Category_ID = ?`;
    try {
        db.getItem(sql, [id], (err, result) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json(result[0] || {});
        });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching category' });
    }
});

module.exports = router;