const express = require('express');
const db = require('../models/db');
const router = express.Router();

router.get('/getWishlist/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ error: 'Invalid user ID' });

    const sql = `
        SELECT w.*, p.Name, p.image, p.Price, p.Author, p.Cover_Format
        FROM wishlist w
        JOIN product p ON w.Product_ID = p.Product_ID
        WHERE w.User_ID = ?`;
    try {
        db.getItem(sql, [userId], (err, result) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json(result || []);
        });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching wishlist' });
    }
});

router.post('/addToWishlist', async (req, res) => {
    const { userId, productId } = req.body;
    if (!userId || !productId) return res.status(400).json({ error: 'Invalid input data' });

    const sql = `INSERT INTO wishlist (User_ID, Product_ID) VALUES (?, ?) ON DUPLICATE KEY UPDATE User_ID = User_ID`;
    try {
        db.executeItem(sql, [userId, productId], (err) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ message: 'Added to wishlist successfully' });
        });
    } catch (err) {
        res.status(500).json({ error: 'Error adding to wishlist' });
    }
});

router.delete('/removeFromWishlist/:wishlistId', async (req, res) => {
    const wishlistId = parseInt(req.params.wishlistId);
    if (isNaN(wishlistId)) return res.status(400).json({ error: 'Invalid wishlist ID' });

    const sql = `DELETE FROM wishlist WHERE Wishlist_ID = ?`;
    try {
        db.executeItem(sql, [wishlistId], (err) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ message: 'Removed from wishlist successfully' });
        });
    } catch (err) {
        res.status(500).json({ error: 'Error removing from wishlist' });
    }
});

module.exports = router;