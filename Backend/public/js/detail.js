document.addEventListener('DOMContentLoaded', () => {
    loadHeader(); // Giả định đây là hàm load header từ header.js
    const productId = new URLSearchParams(window.location.search).get('id');
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!productId) {
        showAlert('Không tìm thấy sản phẩm!', 'danger');
        setTimeout(() => window.location.href = './product.html', 2000);
        return;
    }

    if (user) {
        document.getElementById('guestMenu')?.classList.add('d-none');
        document.getElementById('userMenu')?.classList.remove('d-none');
        checkPurchaseStatus(user.id, productId);
    }

    fetchProductDetail(productId);
    fetchRelatedProducts(productId);
});

async function fetchProductDetail(productId) {
    try {
        showLoading(true);
        const response = await fetch(`http://localhost:5000/api/product/getProduct/${productId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
        });
        if (!response.ok) throw new Error('Không thể tải thông tin sản phẩm');
        const product = await response.json();
        displayProduct(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        showAlert('Không thể tải thông tin sản phẩm!', 'danger');
    } finally {
        showLoading(false);
    }
}

function displayProduct(product) {
    document.getElementById('productImage').src = `./img/${product.image || 'default.jpg'}`;
    document.getElementById('productTitle').textContent = product.Name || 'Không có tiêu đề';
    document.getElementById('productAuthor').querySelector('span').textContent = product.Author || 'Không rõ';
    document.getElementById('productPrice').textContent = `${(product.Price || 0).toLocaleString('vi-VN')} VNĐ`;
    document.getElementById('productStock').querySelector('span').textContent = product.Stock || 0;
    document.getElementById('productPublisher').querySelector('span').textContent = product.Publisher_ID || 'Không rõ'; // Cần API trả tên NXB
    document.getElementById('productYear').querySelector('span').textContent = product.Publication_Date ? new Date(product.Publication_Date).getFullYear() : 'N/A';
    document.getElementById('productFormat').querySelector('span').textContent = product.Cover_Format || 'N/A';
    document.getElementById('productPages').querySelector('span').textContent = product.Page_Count || 'N/A';
    document.getElementById('productISBN').querySelector('span').textContent = product.ISBN || 'N/A';
    document.getElementById('productRating').querySelector('span').innerHTML = `
        ${product.Rating || 0} / 5 <i class="fas fa-star text-warning"></i>
    `; // Thêm icon ngôi sao cho đẹp
    document.getElementById('productDescription').textContent = product.Description?.replace(/\r\n/g, '\n') || 'Không có mô tả.';
    document.getElementById('quantity').max = product.Stock; // Giới hạn số lượng tối đa
}

function increaseQuantity() {
    const input = document.getElementById('quantity');
    const max = parseInt(input.max) || 999; // Giới hạn mặc định nếu không có max
    if (parseInt(input.value) < max) {
        input.value = parseInt(input.value) + 1;
    } else {
        showAlert('Số lượng vượt quá tồn kho!', 'warning');
    }
}

function decreaseQuantity() {
    const input = document.getElementById('quantity');
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

window.addToCart = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const productId = new URLSearchParams(window.location.search).get('id');
    const quantity = parseInt(document.getElementById('quantity').value);

    if (!user) {
        showAlert('Vui lòng đăng nhập để thêm vào giỏ hàng!', 'warning');
        setTimeout(() => window.location.href = './login.html', 2000);
        return;
    }

    try {
        showLoading(true);
        const response = await fetch('http://localhost:5000/api/cart/addToCart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ userId: user.id, productId, quantity })
        });
        if (!response.ok) throw new Error('Không thể thêm vào giỏ hàng');
        const result = await response.json();
        showAlert(result.message || 'Đã thêm vào giỏ hàng!', 'success');
    } catch (error) {
        console.error('Error adding to cart:', error);
        showAlert('Không thể thêm vào giỏ hàng!', 'danger');
    } finally {
        showLoading(false);
    }
};

window.addToWishlist = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const productId = new URLSearchParams(window.location.search).get('id');

    if (!user) {
        showAlert('Vui lòng đăng nhập để thêm vào danh sách yêu thích!', 'warning');
        setTimeout(() => window.location.href = './login.html', 2000);
        return;
    }

    try {
        showLoading(true);
        const response = await fetch('http://localhost:5000/api/wishlist/addToWishlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ userId: user.id, productId })
        });
        if (!response.ok) throw new Error('Không thể thêm vào danh sách yêu thích');
        const result = await response.json();
        showAlert(result.message || 'Đã thêm vào danh sách yêu thích!', 'success');
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        showAlert('Không thể thêm vào danh sách yêu thích!', 'danger');
    } finally {
        showLoading(false);
    }
};

async function checkPurchaseStatus(userId, productId) {
    try {
        const response = await fetch(`http://localhost:5000/api/order/checkPurchase/${userId}/${productId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const result = await response.json();
        if (result.canComment) {
            document.getElementById('commentForm').classList.remove('d-none');
        } else {
            document.getElementById('commentMessage').classList.remove('d-none');
            document.getElementById('commentMessage').textContent = 'Bạn chỉ có thể bình luận sau khi mua và nhận sản phẩm này.';
        }
        fetchComments(productId);
    } catch (error) {
        console.error('Error checking purchase status:', error);
    }
}

async function submitComment() {
    const user = JSON.parse(localStorage.getItem('user'));
    const productId = new URLSearchParams(window.location.search).get('id');
    const commentText = document.getElementById('commentText').value.trim();
    const rating = document.getElementById('rating').value;

    if (!commentText) {
        showAlert('Vui lòng nhập nội dung bình luận!', 'warning');
        return;
    }

    try {
        showLoading(true);
        const response = await fetch('http://localhost:5000/api/comment/addComment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ userId: user.id, productId, commentText, rating })
        });
        if (!response.ok) throw new Error('Không thể gửi bình luận');
        const result = await response.json();
        showAlert(result.message || 'Bình luận đã được gửi!', 'success');
        document.getElementById('commentText').value = '';
        fetchComments(productId);
    } catch (error) {
        console.error('Error submitting comment:', error);
        showAlert('Không thể gửi bình luận!', 'danger');
    } finally {
        showLoading(false);
    }
}

async function fetchComments(productId) {
    try {
        const response = await fetch(`http://localhost:5000/api/comment/getComments/${productId}`);
        const comments = await response.json();
        displayComments(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        displayComments([]); // Hiển thị mặc định khi lỗi
    }
}

function displayComments(comments) {
    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = comments.length ? comments.map(comment => `
        <div class="card mb-3">
            <div class="card-body">
                <p class="card-text">${escapeHTML(comment.commentText)}</p>
                <p class="text-muted">
                    <small>
                        <i class="fas fa-star text-warning"></i> ${comment.rating} / 5 - 
                        ${new Date(comment.createdAt).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}
                    </small>
                </p>
            </div>
        </div>
    `).join('') : '<p class="text-muted text-center">Chưa có bình luận nào.</p>';
}

async function fetchRelatedProducts(productId) {
    try {
        const response = await fetch(`http://localhost:5000/api/product/getRelatedProducts/${productId}?limit=6`);
        const products = await response.json();
        displayRelatedProducts(products);
    } catch (error) {
        console.error('Error fetching related products:', error);
        displayRelatedProducts([]);
    }
}

function displayRelatedProducts(products) {
    const relatedProducts = document.getElementById('relatedProducts');
    relatedProducts.innerHTML = products.length ? products.map(product => `
        <div class="col-md-2 col-sm-4 mb-4">
            <div class="card h-100">
                <img src="./img/${product.image || 'default.jpg'}" class="card-img-top" alt="${product.Name}">
                <div class="card-body">
                    <h6 class="card-title">${product.Name}</h6>
                    <p class="card-text text-danger">${(product.Price || 0).toLocaleString('vi-VN')} VNĐ</p>
                    <a href="./detail.html?id=${product.Product_ID}" class="btn btn-outline-primary btn-sm">Xem chi tiết</a>
                </div>
            </div>
        </div>
    `).join('') : '<p class="text-muted text-center">Không có sản phẩm liên quan.</p>';
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showAlert('Đã đăng xuất!', 'success');
    setTimeout(() => window.location.href = './login.html', 1000);
}

// Helper Functions
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

function showLoading(isLoading) {
    let loading = document.getElementById('loading');
    if (!loading) {
        loading = document.createElement('div');
        loading.id = 'loading';
        loading.className = 'position-fixed top-50 start-50 translate-middle';
        loading.style.zIndex = '1060';
        loading.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';
        document.body.appendChild(loading);
    }
    loading.style.display = isLoading ? 'block' : 'none';
}

function escapeHTML(str) {
    return str.replace(/[&<>"']/g, match => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[match]);
}