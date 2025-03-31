// product.js
document.addEventListener('DOMContentLoaded', () => {
    loadHeader(); // Tải header
    fetchCategories();
    fetchProducts('new');
    fetchSuggestedProducts();

    document.getElementById('sortSelect')?.addEventListener('change', (e) => fetchProducts(e.target.value));
    document.getElementById('searchInput')?.addEventListener('input', searchProducts);
});

async function fetchCategories() {
    try {
        const response = await fetch('http://localhost:5000/api/categories/getAllCategories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const categories = await response.json();
        document.getElementById('categoryList').innerHTML = `
            <li class="list-group-item active" onclick="fetchAllProducts()">Tất cả</li>
            ${categories.map(cat => `
                <li class="list-group-item" onclick="filterByCategory(${cat.Category_ID}, this, '${cat.Category_Name}')">${cat.Category_Name}</li>
            `).join('')}
        `;
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

async function fetchProducts(sort = 'new', page = 1) {
    let url = sort === 'new' ? 'http://localhost:5000/api/product/newProduct' :
             sort === 'views' ? 'http://localhost:5000/api/product/hotProduct' :
             'http://localhost:5000/api/product/getAllProduct';

    try {
        const response = await fetch(`${url}${sort === 'all' ? `?page=${page}&limit=16` : ''}`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        const products = sort === 'all' ? data.products : data;

        if (sort === 'price-asc') products.sort((a, b) => a.Price - b.Price);
        if (sort === 'price-desc') products.sort((a, b) => b.Price - a.Price);
        if (sort === 'purchases') products.sort((a, b) => (b.Purchase_Count || 0) - (a.Purchase_Count || 0));

        displayProducts(products);
        if (sort === 'all') addPagination(data.total, page, sort);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

async function fetchAllProducts() {
    const sort = document.getElementById('sortSelect').value;
    const categoryItems = document.querySelectorAll('#categoryList .list-group-item');
    categoryItems.forEach(item => item.classList.remove('active'));
    categoryItems[0].classList.add('active');
    document.getElementById('productTitle').textContent = 'Tất cả sản phẩm';
    fetchProducts(sort);
}

async function searchProducts(e) {
    const keyword = e.target.value.trim();
    if (!keyword) {
        fetchProducts();
        return;
    }
    try {
        const response = await fetch('http://localhost:5000/api/product/searchProduct', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ keyword })
        });
        if (!response.ok) throw new Error('Failed to search products');
        const products = await response.json();
        displayProducts(products);
        document.getElementById('pagination').innerHTML = '';
        document.getElementById('productTitle').textContent = `Kết quả tìm kiếm: "${keyword}"`;
    } catch (error) {
        console.error('Error searching products:', error);
    }
}

async function filterByCategory(categoryId, element, categoryName) {
    const categoryItems = document.querySelectorAll('#categoryList .list-group-item');
    categoryItems.forEach(item => item.classList.remove('active'));
    element.classList.add('active');

    const sort = document.getElementById('sortSelect').value;
    document.getElementById('productTitle').textContent = categoryName;
    applyFilters(categoryId, sort);
}

async function applyFilters(categoryId = null, sort = 'new', page = 1) {
    try {
        const response = await fetch('http://localhost:5000/api/product/productsByFilters', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ categoryId, sortBy: sort, page })
        });
        if (!response.ok) throw new Error('Failed to fetch filtered products');
        const data = await response.json();
        const products = data.products;

        if (products.length === 0) {
            document.getElementById('productContainer').innerHTML = '<p class="text-center">Không có sản phẩm nào thuộc danh mục này</p>';
        } else {
            displayProducts(products);
        }
        addPagination(data.total, page, sort, categoryId);
    } catch (error) {
        console.error('Error applying filters:', error);
    }
}

function displayProducts(products) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    document.getElementById('productContainer').innerHTML = products.map(product => `
        <div class="product-card">
            <img src="./img/${product.image}" alt="${product.Name}" class="product-image">
            <div class="heart-icon ${wishlist.includes(product.Product_ID) ? 'active' : ''}" onclick="toggleWishlist(${product.Product_ID}, this)">
                <i class="fas fa-heart"></i>
            </div>
            <div class="product-info">
                <h5 class="product-title">${product.Name}</h5>
                <p class="product-author">${product.Author}</p>
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

async function fetchSuggestedProducts() {
    try {
        const response = await fetch('http://localhost:5000/api/product/randomProducts');
        if (!response.ok) throw new Error('Failed to fetch suggested products');
        const products = await response.json();
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        document.getElementById('suggestedProducts').innerHTML = products.map(product => `
            <div class="product-card">
                <img src="./img/${product.image}" alt="${product.Name}" class="product-image">
                <div class="heart-icon ${wishlist.includes(product.Product_ID) ? 'active' : ''}" onclick="toggleWishlist(${product.Product_ID}, this)">
                    <i class="fas fa-heart"></i>
                </div>
                <div class="product-info">
                    <h5 class="product-title">${product.Name}</h5>
                    <p class="product-author">${product.Author}</p>
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
    } catch (error) {
        console.error('Error fetching suggested products:', error);
    }
}

function addPagination(totalItems, currentPage, sort, categoryId = null) {
    const itemsPerPage = 16;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pagination = document.getElementById('pagination');
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    pagination.innerHTML = `
        <button class="btn btn-sm btn-outline-primary" onclick="applyFilters(${categoryId}, '${sort}', 1)" ${currentPage === 1 ? 'disabled' : ''}><i class="fas fa-angle-double-left"></i></button>
        ${Array.from({ length: totalPages }, (_, i) => `
            <button class="btn btn-sm ${i + 1 === currentPage ? 'btn-primary' : 'btn-outline-primary'}" 
                    onclick="applyFilters(${categoryId}, '${sort}', ${i + 1})">${i + 1}</button>
        `).join('')}
        <button class="btn btn-sm btn-outline-primary" onclick="applyFilters(${categoryId}, '${sort}', ${totalPages})" ${currentPage === totalPages ? 'disabled' : ''}><i class="fas fa-angle-double-right"></i></button>
    `;
}

function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (!cart.includes(productId)) {
        cart.push(productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Đã thêm vào giỏ hàng!');
    } else {
        alert('Sản phẩm đã có trong giỏ hàng!');
    }
}

function toggleWishlist(productId, element) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    if (wishlist.includes(productId)) {
        wishlist = wishlist.filter(id => id !== productId);
        element.classList.remove('active');
    } else {
        wishlist.push(productId);
        element.classList.add('active');
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}