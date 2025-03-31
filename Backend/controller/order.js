const express = require('express');
const db = require('../models/db');
const router = express.Router();

router.get('/getOrders/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) return res.status(400).json({ error: 'Invalid user ID' });

    const sql = `SELECT * FROM \`order\` WHERE User_ID = ?`;
    try {
        db.getItem(sql, [userId], (err, result) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json(result || []);
        });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching orders' });
    }
});

router.get('/getOrderDetail/:orderId', async (req, res) => {
    const orderId = parseInt(req.params.orderId);
    if (isNaN(orderId)) return res.status(400).json({ error: 'Invalid order ID' });

    const sql = `
        SELECT od.*, p.Name, p.image, o.Order_date, o.Status, o.Recipient_Name, o.Recipient_Phone, o.Recipient_address
        FROM order_detail od
        JOIN product p ON od.Product_ID = p.Product_ID
        JOIN \`order\` o ON od.Order_ID = o.Order_ID
        WHERE od.Order_ID = ?`;
    try {
        db.getItem(sql, [orderId], (err, result) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json(result || []);
        });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching order details' });
    }
});

router.post('/createOrder', async (req, res) => {
    const { userId, voucherId, paymentMethod, recipientName, recipientPhone, recipientAddress, cartItems } = req.body;
    if (!userId || !paymentMethod || !recipientName || !recipientPhone || !recipientAddress || !cartItems?.length) {
        return res.status(400).json({ error: 'Invalid input data' });
    }

    let totalAmount = cartItems.reduce((sum, item) => sum + item.Price * item.Quantity, 0);
    const connection = db.connection;

    try {
        connection.beginTransaction(async (err) => {
            if (err) throw err;

            // Kiểm tra voucher
            if (voucherId) {
                const voucherSql = `SELECT Discount_Amount FROM voucher WHERE Voucher_ID = ? AND Expiration_Date > NOW()`;
                db.getItem(voucherSql, [voucherId], (err, voucher) => {
                    if (!err && voucher.length) {
                        totalAmount -= voucher[0].Discount_Amount;
                    }
                });
            }

            const paymentSql = `INSERT INTO payment (Payment_Name, Payment_Method) VALUES (?, ?)`;
            db.executeItem(paymentSql, [`Order payment #${Date.now()}`, paymentMethod], (err, paymentResult) => {
                if (err) throw err;
                const paymentId = paymentResult.insertId;

                const orderSql = `INSERT INTO \`order\` (User_ID, Voucher_ID, Payment_ID, Total_amount, Recipient_Name, Recipient_Phone, Recipient_address) 
                                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
                db.executeItem(orderSql, [userId, voucherId || null, paymentId, totalAmount, recipientName, recipientPhone, recipientAddress], (err, orderResult) => {
                    if (err) throw err;
                    const orderId = orderResult.insertId;

                    const orderDetailSql = `INSERT INTO order_detail (Order_ID, Product_ID, Quantity, Price) VALUES ?`;
                    const orderDetails = cartItems.map(item => [orderId, item.Product_ID, item.Quantity, item.Price]);
                    db.executeItem(orderDetailSql, [orderDetails], (err) => {
                        if (err) throw err;

                        const deleteCartSql = `DELETE FROM cart_detail WHERE User_ID = ?`;
                        db.executeItem(deleteCartSql, [userId], (err) => {
                            if (err) throw err;

                            connection.commit((err) => {
                                if (err) throw err;
                                res.json({ message: 'Order created successfully', orderId });
                            });
                        });
                    });
                });
            });
        });
    } catch (err) {
        connection.rollback();
        res.status(500).json({ error: 'Error creating order' });
    }
});

module.exports = router;