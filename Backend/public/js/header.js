function loadHeader() {
    fetch('./header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                document.getElementById('guestMenu')?.classList.add('d-none');
                document.getElementById('userMenu')?.classList.remove('d-none');
                updateCartCount(user.id); // Cập nhật số lượng giỏ hàng khi load header
            }
            handleScroll();
        })
        .catch(error => console.error('Error loading header:', error));
}

function handleScroll() {
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

function searchProducts(event) {
    event.preventDefault();
    const keyword = document.getElementById('headerSearch').value.trim();
    if (keyword) {
        window.location.href = `./product.html?search=${encodeURIComponent(keyword)}`;
    }
}

async function liveSearch(keyword) {
    const searchResults = document.getElementById('searchResults');
    if (!keyword || keyword.trim() === '') {
        searchResults.innerHTML = '';
        searchResults.style.display = 'none';
        return;
    }
    try {
        const response = await fetch(`http://localhost:5000/api/product/searchProduct`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ keyword: keyword.trim() })
        });
        if (!response.ok) throw new Error('Failed to search products');
        const products = await response.json();
        searchResults.style.display = 'flex';
        searchResults.innerHTML = products.slice(0, 5).map(product => `
            <div class="search-result-item" onclick="viewProduct(${product.Product_ID})">
                <img src="./img/${product.image}" alt="${product.Name}">
                <div>
                    <span>${product.Name}</span>
                    <small>${product.Author}</small>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error searching products:', error);
        searchResults.innerHTML = '';
        searchResults.style.display = 'none';
    }
}

function viewProduct(productId) {
    window.location.href = `./detail.html?id=${productId}`;
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = './login.html';
    updateCartCount(0); // Reset số lượng về 0 khi đăng xuất
}

// Hàm cập nhật số lượng giỏ hàng
async function updateCartCount(userId) {
    const cartCountElement = document.querySelector('.cart-count');
    if (!userId) {
        cartCountElement.textContent = '0';
        return;
    }
    try {
        const response = await fetch(`http://localhost:5000/api/cart/getCart/${userId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!response.ok) throw new Error('Failed to fetch cart');
        const cartItems = await response.json();
        const totalQuantity = cartItems.reduce((sum, item) => sum + item.Quantity, 0);
        cartCountElement.textContent = totalQuantity;
    } catch (error) {
        console.error('Error updating cart count:', error);
        cartCountElement.textContent = '0';
    }
}

// Gọi handleScroll khi trang được tải
document.addEventListener('DOMContentLoaded', handleScroll);