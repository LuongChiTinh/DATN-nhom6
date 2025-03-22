const mysql = require('mysql');

// Tạo kết nối MySQL chỉ một lần
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'datn'
});

// Kết nối đến MySQL ngay khi ứng dụng chạy
connection.connect(function (err) {
    if (!err) {
        console.log('✅ Kết nối MySQL thành công!');
    } else {
        console.error('❌ Lỗi kết nối MySQL:', err.message);
    }
});

// Hàm thực hiện các truy vấn `INSERT`, `UPDATE`, `DELETE`
exports.executeItem = function (sql, callbackQuery) {
    connection.query(sql, function (err, results) {
        if (err) {
            console.error('❌ Lỗi truy vấn MySQL:', err);
            return callbackQuery(err, null);
        }
        callbackQuery(null, results);
    });
};

// Hàm lấy dữ liệu `SELECT`
exports.getItem = function (sql, callbackQuery) {
    connection.query(sql, function (err, results) {
        if (err) {
            console.error('❌ Lỗi truy vấn MySQL:', err);
            return callbackQuery(err, null);
        }
        callbackQuery(null, results);
    });
};

// Đóng kết nối khi ứng dụng kết thúc
process.on('SIGINT', () => {
    connection.end(err => {
        if (err) {
            console.error('❌ Lỗi đóng kết nối MySQL:', err);
        } else {
            console.log('🔴 Đã đóng kết nối MySQL.');
        }
        process.exit();
    });
});
