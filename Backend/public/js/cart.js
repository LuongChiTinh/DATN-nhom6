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
    fetchCart(user.id);
});

async function fetchCart(userId) {
    try {
        const response = await fetch(`http://localhost:5000/api/cart/getCart/${userId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!response.ok) throw new Error('Failed to fetch cart');
        const items = await response.json();
        const cartItems = document.getElementById('cartItems');
        if (items.length === 0) {
            cartItems.innerHTML = '<tr><td colspan="7" class="text-center">Giỏ hàng trống</td></tr>';
            document.getElementById('cartSubtotal').textContent = '0 VNĐ';
            document.getElementById('cartTotal').textContent = '0 VNĐ';
            return;
        }
        cartItems.innerHTML = items.map((item, index) => `
            <tr>
                <td><input type="checkbox" class="select-item" data-id="${item.Cart_Detail_ID}" data-product-id="${item.Product_ID}" onchange="updateTotal()"></td>
                <td>${index + 1}</td>
                <td class="d-flex align-items-center">
                    <img src="./img/${item.image}" alt="${item.Name}">
                    <span class="ms-3">${item.Name}</span>
                </td>
                <td>
                    <div class="quantity-controls">
                        <button onclick="updateQuantity(${item.Cart_Detail_ID}, ${item.Quantity - 1})">-</button>
                        <input type="number" value="${item.Quantity}" min="1" id="qty-${item.Cart_Detail_ID}" onchange="updateQuantity(${item.Cart_Detail_ID}, this.value)">
                        <button onclick="updateQuantity(${item.Cart_Detail_ID}, ${item.Quantity + 1})">+</button>
                    </div>
                </td>
                <td>${item.Price.toLocaleString()} VNĐ</td>
                <td id="total-${item.Cart_Detail_ID}">${(item.Price * item.Quantity).toLocaleString()} VNĐ</td>
                <td>
                    <button class="remove-btn" onclick="removeFromCart(${item.Cart_Detail_ID})"><i class="fas fa-trash"></i></button>
                    <button class="view-btn" onclick="viewProduct(${item.Product_ID})"><i class="fas fa-eye"></i></button>
                </td>
            </tr>
        `).join('');
        updateTotal();
    } catch (error) {
        console.error('Error fetching cart:', error);
        alert('Không thể tải giỏ hàng!');
    }
}

function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll').checked;
    document.querySelectorAll('.select-item').forEach(checkbox => {
        checkbox.checked = selectAll;
    });
    updateTotal();
}

async function updateQuantity(cartDetailId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(cartDetailId);
        return;
    }
    try {
        const response = await fetch(`http://localhost:5000/api/cart/updateCart/${cartDetailId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ quantity: parseInt(newQuantity) })
        });
        if (!response.ok) throw new Error('Failed to update quantity');
        const result = await response.json();
        fetchCart(JSON.parse(localStorage.getItem('user')).id);
    } catch (error) {
        console.error('Error updating quantity:', error);
        alert('Không thể cập nhật số lượng!');
    }
}

async function removeFromCart(cartDetailId) {
    try {
        const response = await fetch(`http://localhost:5000/api/cart/removeFromCart/${cartDetailId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!response.ok) throw new Error('Failed to remove item');
        const result = await response.json();
        fetchCart(JSON.parse(localStorage.getItem('user')).id);
    } catch (error) {
        console.error('Error removing from cart:', error);
        alert('Không thể xóa sản phẩm khỏi giỏ hàng!');
    }
}

function updateTotal() {
    const userId = JSON.parse(localStorage.getItem('user')).id;
    fetch(`http://localhost:5000/api/cart/getCart/${userId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(response => response.json())
    .then(items => {
        let subtotal = 0;
        document.querySelectorAll('.select-item:checked').forEach(checkbox => {
            const cartDetailId = parseInt(checkbox.dataset.id);
            const item = items.find(i => i.Cart_Detail_ID === cartDetailId);
            subtotal += item.Price * item.Quantity;
        });
        document.getElementById('cartSubtotal').textContent = subtotal.toLocaleString() + ' VNĐ';
        document.getElementById('cartTotal').textContent = subtotal.toLocaleString() + ' VNĐ'; // Chưa áp dụng voucher
    });
}

async function applyVoucher() {
    const voucherCode = document.getElementById('voucherCode').value.trim();
    if (!voucherCode) {
        alert('Vui lòng nhập mã giảm giá!');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/voucher/checkVoucher', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ voucherCode })
        });
        const data = await response.json();
        if (data.valid) {
            const subtotal = parseInt(document.getElementById('cartSubtotal').textContent.replace(/[^\d]/g, ''));
            const discount = data.discountAmount;
            const total = subtotal - discount > 0 ? subtotal - discount : 0;
            document.getElementById('cartTotal').textContent = total.toLocaleString() + ' VNĐ';
            alert('Áp dụng mã giảm giá thành công!');
        } else {
            alert('Mã giảm giá không hợp lệ hoặc đã hết hạn!');
        }
    } catch (error) {
        console.error('Error applying voucher:', error);
        alert('Không thể áp dụng mã giảm giá!');
    }
}

async function checkout() {
    const user = JSON.parse(localStorage.getItem('user'));
    try {
        const cartResponse = await fetch(`http://localhost:5000/api/cart/getCart/${user.id}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const cartItems = await cartResponse.json();
        const selectedItems = Array.from(document.querySelectorAll('.select-item:checked')).map(checkbox => {
            const cartDetailId = parseInt(checkbox.dataset.id);
            return cartItems.find(item => item.Cart_Detail_ID === cartDetailId);
        });
        if (selectedItems.length === 0) {
            alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán!');
            return;
        }
        localStorage.setItem('checkoutItems', JSON.stringify(selectedItems));
        window.location.href = './checkout.html';
    } catch (error) {
        console.error('Error during checkout preparation:', error);
        alert('Có lỗi xảy ra khi chuẩn bị thanh toán!');
    }
}

function viewProduct(productId) {
    window.location.href = `./detail.html?id=${productId}`;
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = './login.html';
}