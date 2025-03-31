document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    fetchCategories();
    fetchNewProducts();
    fetchHotProducts();
    fetchSuggestedProducts();
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});

async function fetchCategories() {
    try {
        const response = await fetch('http://localhost:5000/api/categories/getAllCategories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const categories = await response.json();
        const container = document.getElementById('categoryContainer');
        container.innerHTML = categories.map(cat => `
            <div class="category-card" onclick="filterByCategory(${cat.Category_ID})">${cat.Category_Name}</div>
        `).join('');
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

async function fetchNewProducts() {
    try {
        const response = await fetch('http://localhost:5000/api/product/newProduct');
        if (!response.ok) throw new Error('Failed to fetch new products');
        const products = await response.json();
        displayProducts(products, 'newProductContainer');
    } catch (error) {
        console.error('Error fetching new products:', error);
    }
}

async function fetchHotProducts() {
    try {
        const response = await fetch('http://localhost:5000/api/product/hotProduct');
        if (!response.ok) throw new Error('Failed to fetch hot products');
        const products = await response.json();
        displayProducts(products, 'hotProductContainer');
    } catch (error) {
        console.error('Error fetching hot products:', error);
    }
}

async function fetchSuggestedProducts() {
    try {
        const response = await fetch('http://localhost:5000/api/product/randomProducts');
        if (!response.ok) throw new Error('Failed to fetch suggested products');
        const products = await response.json();
        displayProducts(products, 'suggestedProductContainer');
    } catch (error) {
        console.error('Error fetching suggested products:', error);
        document.getElementById('suggestedProductContainer').innerHTML = '<p>Không thể tải sản phẩm gợi ý!</p>';
    }
}

function displayProducts(products, containerId) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const container = document.getElementById(containerId);
    
    console.log(`Products for ${containerId}:`, products);
    
    if (!products || products.length === 0) {
        container.innerHTML = '<p>Không có sản phẩm để hiển thị!</p>';
        return;
    }

    container.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="./img/${product.image}" alt="${product.Name}" class="product-image">
            <div class="heart-icon ${wishlist.includes(product.Product_ID) ? 'active' : ''}" onclick="toggleWishlist(${product.Product_ID}, this)">
                <i class="fas fa-heart"></i>
            </div>
            <div class="product-info">
                <h5 class="product-title">${product.Name}</h5>
                <p class="product-author"><strong>Tác giả:</strong> ${product.Author}</p>
                <div class="product-footer">
                    <p class="product-price">Giá: ${product.Price.toLocaleString()} VNĐ</p>
                    <div class="action-buttons">
                        <button class="view-btn" onclick="viewProduct(${product.Product_ID})"><i class="fas fa-eye"></i></button>
                        <button class="cart-btn" onclick="addToCart(${product.Product_ID})"><i class="fas fa-shopping-cart"></i></button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function viewProduct(productId) {
    window.location.href = `./detail.html?id=${productId}`;
}

async function toggleWishlist(productId, element) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        showAlert('Vui lòng đăng nhập để thêm vào danh sách yêu thích!', 'warning');
        setTimeout(() => window.location.href = './login.html', 2000);
        return;
    }
    try {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        let message;
        if (wishlist.includes(productId)) {
            const response = await fetch(`http://localhost:5000/api/wishlist/removeFromWishlist`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ userId: user.id, productId })
            });
            if (!response.ok) throw new Error('Failed to remove from wishlist');
            const result = await response.json();
            wishlist.splice(wishlist.indexOf(productId), 1);
            element.classList.remove('active');
            message = result.message || 'Đã xóa khỏi danh sách yêu thích';
            showAlert(message, 'success');
        } else {
            const response = await fetch('http://localhost:5000/api/wishlist/addToWishlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ userId: user.id, productId })
            });
            if (!response.ok) throw new Error('Failed to add to wishlist');
            const result = await response.json();
            wishlist.push(productId);
            element.classList.add('active');
            message = result.message || 'Đã thêm vào danh sách yêu thích';
            showAlert(message, 'success');
        }
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    } catch (error) {
        console.error('Error toggling wishlist:', error);
        showAlert('Không thể cập nhật danh sách yêu thích!', 'danger');
    }
}

async function addToCart(productId) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        showAlert('Vui lòng đăng nhập để thêm vào giỏ hàng!', 'warning');
        setTimeout(() => window.location.href = './login.html', 2000);
        return;
    }
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
        showAlert(result.message || 'Đã thêm vào giỏ hàng!', 'success');
        updateCartCount(user.id); // Cập nhật số lượng sau khi thêm vào giỏ
    } catch (error) {
        console.error('Error adding to cart:', error);
        showAlert('Không thể thêm vào giỏ hàng!', 'danger');
    }
}
function filterByCategory(categoryId) {
    window.location.href = `./product.html?category=${categoryId}`;
}

// Hàm hiển thị thông báo giống detail.js
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show fixed-top mx-auto mt-3`;
    alertDiv.style.maxWidth = '500px';
    alertDiv.style.zIndex = '1050';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 3000);
}