const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test-datn'
});

connection.connect((err) => {
    if (!err) {
        console.log('✅ MySQL connection successful!');
    } else {
        console.error('❌ MySQL connection error:', err.message);
    }
});

exports.connection = connection;

exports.executeItem = function (sql, params, callbackQuery) {
    connection.query(sql, params, (err, results) => {
        if (err) {
            console.error('❌ MySQL query error:', err);
            return callbackQuery(err, null);
        }
        callbackQuery(null, results);
    });
};

exports.getItem = function (sql, params, callbackQuery) {
    connection.query(sql, params, (err, results) => {
        if (err) {
            console.error('❌ MySQL query error:', err);
            return callbackQuery(err, null);
        }
        callbackQuery(null, results);
    });
};

process.on('SIGINT', () => {
    connection.end((err) => {
        if (err) {
            console.error('❌ Error closing MySQL connection:', err);
        } else {
            console.log('🔴 MySQL connection closed.');
        }
        process.exit();
    });
});