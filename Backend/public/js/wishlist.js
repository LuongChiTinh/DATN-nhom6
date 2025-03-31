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
    fetchWishlist(user.id);
    fetchSuggestions();

    document.getElementById('sortWishlist').addEventListener('change', (e) => {
        fetchWishlist(user.id, e.target.value);
    });
});

async function fetchWishlist(userId, sortBy = '') {
    try {
        const response = await fetch(`http://localhost:5000/api/wishlist/getWishlist/${userId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!response.ok) throw new Error('Failed to fetch wishlist');
        let items = await response.json();

        if (sortBy) {
            if (sortBy === 'price-asc') items.sort((a, b) => a.Price - b.Price);
            if (sortBy === 'price-desc') items.sort((a, b) => b.Price - b.Price);
            if (sortBy === 'name') items.sort((a, b) => a.Name.localeCompare(b.Name));
            if (sortBy === 'date') items.sort((a, b) => new Date(b.Date_Added) - new Date(a.Date_Added));
        }

        document.getElementById('wishlistItems').innerHTML = items.map(item => `
            <div class="product-card">
                <img src="./img/${item.image}" alt="${item.Name}" class="product-image">
                <div class="product-info">
                    <h5 class="product-title">${item.Name}</h5>
                    <p class="product-author">${item.Author}</p>
                    <p class="product-price">${item.Price.toLocaleString()} VNĐ</p>
                    <p class="product-stock">${item.Stock > 0 ? 'Còn hàng' : 'Hết hàng'}</p>
                    <p class="product-date">Thêm: ${new Date(item.Date_Added).toLocaleDateString('vi-VN')}</p>
                    <button class="btn btn-primary" onclick="addToCartFromWishlist(${item.Product_ID})">Thêm vào giỏ</button>
                    <button class="btn btn-danger" onclick="removeFromWishlist(${item.Wishlist_ID})">Xóa</button>
                    <button class="btn btn-info" onclick="viewProduct(${item.Product_ID})">Xem chi tiết</button>
                </div>
            </div>
        `).join('') || '<p class="text-center">Danh sách yêu thích trống.</p>';
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        alert('Không thể tải danh sách yêu thích!');
    }
}

async function fetchSuggestions() {
    try {
        const response = await fetch('http://localhost:5000/api/product/suggestions', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!response.ok) throw new Error('Failed to fetch suggestions');
        const items = await response.json();
        document.getElementById('suggestionItems').innerHTML = items.slice(0, 3).map(item => `
            <div class="product-card">
                <img src="./img/${item.image}" alt="${item.Name}" class="product-image">
                <div class="product-info">
                    <h5 class="product-title">${item.Name}</h5>
                    <p class="product-author">${item.Author}</p>
                    <p class="product-price">${item.Price.toLocaleString()} VNĐ</p>
                    <button class="btn btn-primary" onclick="addToCartFromWishlist(${item.Product_ID})">Thêm vào giỏ</button>
                    <button class="btn btn-info" onclick="viewProduct(${item.Product_ID})">Xem chi tiết</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
}

async function addToCartFromWishlist(productId) {
    const user = JSON.parse(localStorage.getItem('user'));
    try {
        const response = await fetch('http://localhost:5000/api/cart/addToCart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ userId: user.id, productId, quantity: 1 })
        });
        if (!response.ok) throw new Error('Failed to add to cart');
        const result = await response.json();
        alert(result.message);
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Không thể thêm vào giỏ hàng!');
    }
}

async function removeFromWishlist(wishlistId) {
    try {
        const response = await fetch(`http://localhost:5000/api/wishlist/removeFromWishlist/${wishlistId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!response.ok) throw new Error('Failed to remove from wishlist');
        const result = await response.json();
        alert(result.message);
        fetchWishlist(JSON.parse(localStorage.getItem('user')).id);
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        alert('Không thể xóa khỏi danh sách yêu thích!');
    }
}

async function clearWishlist() {
    if (confirm('Bạn có chắc muốn xóa toàn bộ wishlist?')) {
        const userId = JSON.parse(localStorage.getItem('user')).id;
        try {
            const response = await fetch(`http://localhost:5000/api/wishlist/clearWishlist/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (!response.ok) throw new Error('Failed to clear wishlist');
            fetchWishlist(userId);
        } catch (error) {
            console.error('Error clearing wishlist:', error);
            alert('Không thể xóa toàn bộ wishlist!');
        }
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