document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    const orderId = new URLSearchParams(window.location.search).get('id');
    const token = localStorage.getItem('token');
    if (!token || !orderId) {
        window.location.href = './login.html';
        return;
    }
    fetchOrderInfo(orderId);
});

async function fetchOrderInfo(orderId) {
    try {
        const response = await fetch(`http://localhost:5000/api/order/getOrderDetail/${orderId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!response.ok) throw new Error('Failed to fetch order details');
        const order = await response.json();
        displayOrderInfo(order);
    } catch (error) {
        console.error('Error fetching order info:', error);
        alert('Không thể tải thông tin đơn hàng! Vui lòng thử lại.');
    }
}

function displayOrderInfo(order) {
    const orderDetailsContainer = document.getElementById('orderDetails');
    const orderItemsContainer = document.getElementById('orderItems');
    const orderTotal = document.getElementById('orderTotal');

    orderDetailsContainer.innerHTML = `
        <p><strong>Tên người nhận:</strong> ${order[0].Recipient_Name}</p>
        <p><strong>Số điện thoại:</strong> ${order[0].Recipient_Phone}</p>
        <p><strong>Địa chỉ:</strong> ${order[0].Recipient_address}</p>
        <p><strong>Trạng thái:</strong> <span class="order-status ${order[0].Status.toLowerCase()}">${order[0].Status}</span></p>
        <p><strong>Ngày đặt:</strong> ${new Date(order[0].Order_date).toLocaleString('vi-VN')}</p>
        <button class="btn btn-secondary mt-2" onclick="window.location.href='./order.html'">Quay lại danh sách</button>
    `;

    orderItemsContainer.innerHTML = order.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td><img src="./img/${item.image}" alt="${item.Name}" class="order-product-image" width="50"></td>
            <td>${item.Name}</td>
            <td>${item.Quantity}</td>
            <td>${item.Price.toLocaleString()} VNĐ</td>
            <td>${(item.Quantity * item.Price).toLocaleString()} VNĐ</td>
        </tr>
    `).join('');

    const total = order.reduce((sum, item) => sum + item.Price * item.Quantity, 0);
    orderTotal.textContent = `${total.toLocaleString()} VNĐ`;
}