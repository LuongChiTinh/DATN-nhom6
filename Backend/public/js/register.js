document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && localStorage.getItem('token')) {
        document.getElementById('guestMenu')?.classList.add('d-none');
        document.getElementById('userMenu')?.classList.remove('d-none');
        window.location.href = './index.html';
    }
});

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const phone = document.getElementById('phone').value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!name || !email || !password || !phone) {
        alert('Vui lòng nhập đầy đủ thông tin!');
        return;
    }
    if (!emailRegex.test(email)) {
        alert('Email không hợp lệ!');
        return;
    }
    if (!phoneRegex.test(phone)) {
        alert('Số điện thoại phải gồm 10 chữ số!');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/user/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, phone })
        });
        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            window.location.href = './login.html';
        } else {
            alert(result.error || 'Đăng ký thất bại!');
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('Có lỗi xảy ra khi đăng ký! Vui lòng thử lại.');
    }
});

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = './login.html';
}