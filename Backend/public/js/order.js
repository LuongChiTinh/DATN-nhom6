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
    fetchOrders(user.id);

    // Thêm sự kiện tìm kiếm theo trạng thái
    document.getElementById('statusFilter')?.addEventListener('change', () => fetchOrders(user.id));
});

async function fetchOrders(userId) {
    try {
        const statusFilter = document.getElementById('statusFilter')?.value || '';
        const response = await fetch(`http://localhost:5000/api/order/getOrders/${userId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!response.ok) throw new Error('Failed to fetch orders');
        let orders = await response.json();
        
        if (statusFilter) {
            orders = orders.filter(order => order.Status === statusFilter);
        }

        const orderItems = document.getElementById('orderItems');
        orderItems.innerHTML = orders.map(order => `
            <div class="col-md-4 mb-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Đơn hàng #${order.Order_ID}</h5>
                        <p class="card-text">Ngày đặt: ${new Date(order.Order_date).toLocaleDateString('vi-VN')}</p>
                        <p class="card-text">Trạng thái: <span class="order-status ${order.Status.toLowerCase()}">${order.Status}</span></p>
                        <p class="card-text">Tổng tiền: ${order.Total_amount.toLocaleString()} VNĐ</p>
                        <button class="btn btn-primary" onclick="showOrderDetail(${order.Order_ID})">Xem chi tiết</button>
                    </div>
                </div>
            </div>
        `).join('') || '<p>Không có đơn hàng nào.</p>';
    } catch (error) {
        console.error('Error fetching orders:', error);
        alert('Không thể tải danh sách đơn hàng!');
    }
}

function showOrderDetail(orderId) {
    window.location.href = `./order-info.html?id=${orderId}`;
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = './login.html';
}