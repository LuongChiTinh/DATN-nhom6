document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    if (user && token) {
        document.getElementById('guestMenu')?.classList.add('d-none');
        document.getElementById('userMenu')?.classList.remove('d-none');
        window.location.href = './index.html';
    }
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
        alert('Vui lòng nhập đầy đủ email và mật khẩu!');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const result = await response.json();
        if (response.ok) {
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
            alert(result.message);
            window.location.href = './index.html';
        } else {
            alert(result.error || 'Đăng nhập thất bại!');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('Có lỗi xảy ra khi đăng nhập! Vui lòng thử lại.');
    }
});

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = './login.html';
}