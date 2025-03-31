const express = require('express');
const db = require('../models/db');
const router = express.Router();

router.get('/getCart/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ error: 'Invalid user ID' });

    const sql = `
        SELECT cd.*, p.Name, p.image, p.Price
        FROM cart_detail cd
        JOIN product p ON cd.Product_ID = p.Product_ID
        WHERE cd.User_ID = ?`;
    
    try {
        db.getItem(sql, [userId], (err, result) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json(result || []);
        });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching cart' });
    }
});

router.post('/addToCart', async (req, res) => {
    const { userId, productId, quantity } = req.body;
    if (!userId || !productId || !quantity || quantity <= 0) {
        return res.status(400).json({ error: 'Invalid input data' });
    }

    // Kiểm tra tồn kho
    const stockCheckSql = `SELECT Stock FROM product WHERE Product_ID = ?`;
    db.getItem(stockCheckSql, [productId], (err, result) => {
        if (err || !result.length) return res.status(500).json({ error: 'Database error or product not found' });
        const stock = result[0].Stock;
        if (stock < quantity) return res.status(400).json({ error: 'Sản phẩm không đủ tồn kho' });

        const sql = `
            INSERT INTO cart_detail (User_ID, Product_ID, Quantity) 
            VALUES (?, ?, ?) 
            ON DUPLICATE KEY UPDATE Quantity = Quantity + VALUES(Quantity)`;
        
        db.executeItem(sql, [userId, productId, quantity], (err) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ message: 'Added to cart successfully' });
        });
    });
});

router.delete('/removeFromCart/:cartDetailId', async (req, res) => {
    const cartDetailId = parseInt(req.params.cartDetailId);
    if (isNaN(cartDetailId)) return res.status(400).json({ error: 'Invalid cart detail ID' });

    const sql = `DELETE FROM cart_detail WHERE Cart_Detail_ID = ?`;
    
    try {
        db.executeItem(sql, [cartDetailId], (err) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ message: 'Removed from cart successfully' });
        });
    } catch (err) {
        res.status(500).json({ error: 'Error removing from cart' });
    }
});

router.put('/updateCart/:cartDetailId', async (req, res) => {
    const cartDetailId = parseInt(req.params.cartDetailId);
    const { quantity } = req.body;
    if (isNaN(cartDetailId) || !quantity || quantity <= 0) {
        return res.status(400).json({ error: 'Invalid input data' });
    }

    const sql = `UPDATE cart_detail SET Quantity = ? WHERE Cart_Detail_ID = ?`;
    
    try {
        db.executeItem(sql, [quantity, cartDetailId], (err) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ message: 'Updated quantity successfully' });
        });
    } catch (err) {
        res.status(500).json({ error: 'Error updating cart' });
    }
});

module.exports = router;