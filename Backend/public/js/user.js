document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (!token || !user) {
        window.location.href = './login.html';
        return;
    }
    document.getElementById('guestMenu')?.classList.add('d-none');
    document.getElementById('userMenu')?.classList.remove('d-none');
    fetchUserInfo(user.id);
});

async function fetchUserInfo(userId) {
    try {
        const response = await fetch(`http://localhost:5000/api/user/getUser/${userId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!response.ok) throw new Error('Failed to fetch user info');
        const user = await response.json();
        document.getElementById('name').value = user.Name;
        document.getElementById('email').value = user.Email;
        document.getElementById('phone').value = user.Phone;
    } catch (error) {
        console.error('Error fetching user info:', error);
        alert('Không thể tải thông tin người dùng!');
    }
}

document.getElementById('userInfoForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();

    const phoneRegex = /^\d{10}$/;
    if (!name || !phone) {
        alert('Vui lòng nhập đầy đủ thông tin!');
        return;
    }
    if (!phoneRegex.test(phone)) {
        alert('Số điện thoại phải gồm 10 chữ số!');
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/user/updateUser/${user.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ name, phone })
        });
        if (!response.ok) throw new Error('Failed to update user');
        const result = await response.json();
        alert(result.message);
        localStorage.setItem('user', JSON.stringify({ ...user, Name: name, Phone: phone }));
    } catch (error) {
        console.error('Error updating user:', error);
        alert('Không thể cập nhật thông tin! Vui lòng thử lại.');
    }
});

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = './login.html';
}