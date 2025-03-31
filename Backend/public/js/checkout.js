
document.addEventListener('DOMContentLoaded', () => {
    loadHeader(); 
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (!token || !user) {
        window.location.href = './login.html';
        return;
    }
    document.getElementById('guestMenu').classList.add('d-none');
    document.getElementById('userMenu').classList.remove('d-none');
    fetchCart(user.id);
});

async function fetchCart(userId) {
    try {
        const response = await fetch(`http://localhost:5000/api/cart/getCart/${userId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!response.ok) throw new Error('Failed to fetch cart');
        const cartItems = await response.json();
        displayCart(cartItems);
        calculateTotal(cartItems);
    } catch (error) {
        console.error('Error fetching cart:', error);
        alert('Không thể tải giỏ hàng!');
    }
}

function displayCart(cartItems) {
    const cartItemsContainer = document.getElementById('cartItems');
    cartItemsContainer.innerHTML = cartItems.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${item.Name}</td>
            <td>${item.Quantity}</td>
            <td>${item.Price.toLocaleString()} VNĐ</td>
            <td>${(item.Price * item.Quantity).toLocaleString()} VNĐ</td>
        </tr>
    `).join('');
}

function calculateTotal(cartItems) {
    const subtotal = cartItems.reduce((sum, item) => sum + item.Price * item.Quantity, 0);
    const shipping = 20000;
    const total = subtotal + shipping;
    document.getElementById('subtotal').textContent = `${subtotal.toLocaleString()} VNĐ`;
    document.getElementById('total').textContent = `${total.toLocaleString()} VNĐ`;
}

document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    const recipientName = document.getElementById('recipientName').value;
    const recipientPhone = document.getElementById('recipientPhone').value;
    const recipientAddress = document.getElementById('recipientAddress').value;
    const voucherCode = document.getElementById('voucherCode').value;
    const paymentMethod = document.getElementById('paymentMethod').value;

    try {
        const cartResponse = await fetch(`http://localhost:5000/api/cart/getCart/${user.id}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const cartItems = await cartResponse.json();

        const order = {
            userId: user.id,
            voucherId: voucherCode || null,
            paymentMethod,
            recipientName,
            recipientPhone,
            recipientAddress,
            cartItems
        };

        const response = await fetch('http://localhost:5000/api/order/createOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(order)
        });
        if (!response.ok) throw new Error('Failed to create order');
        const result = await response.json();
        alert(result.message);
        window.location.href = `./order-info.html?id=${result.orderId}`;
    } catch (error) {
        console.error('Error during checkout:', error);
        alert('Không thể hoàn tất thanh toán!');
    }
});

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = './login.html';
}