document.addEventListener("DOMContentLoaded", function () {
    fetchCategories();
    fetchProducts();
});

const productsPerPage = 12; // Số sản phẩm mỗi trang
let currentPage = 1;
let allProducts = []; // Dữ liệu sản phẩm

function fetchCategories() {
    fetch("http://localhost:5000/getAllCategories")
        .then(response => response.json())
        .then(data => showCategories(data))
        .catch(error => console.error("Lỗi khi lấy danh mục:", error));
}

function showCategories(categories) {
    const categoryContainer = document.querySelector(".showdanhmc");
    categoryContainer.innerHTML = ""; 

    categories.forEach(category => {
        const categoryItem = document.createElement("div");
        categoryItem.classList.add("category-item");
        categoryItem.innerHTML = `<p>${category.Category_Name}</p>`;
        categoryContainer.appendChild(categoryItem);
    });
}

function fetchProducts() {
    fetch("http://localhost:5000/getAllProduct")
        .then(response => response.json())
        .then(data => {
            allProducts = data; // Lưu tất cả sản phẩm vào biến
            currentPage = 1; // Đặt lại trang đầu tiên
            renderProducts();
        })
        .catch(error => console.error("Lỗi khi lấy sản phẩm:", error));
}

function renderProducts() {
    const productWrapper = document.querySelector(".product-wrapper");
    productWrapper.innerHTML = ""; 

    // Tính toán sản phẩm cần hiển thị
    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    const productsToShow = allProducts.slice(start, end);

    // Hiển thị sản phẩm
    productsToShow.forEach(product => {
        const productCard = `
            <div class="product-card">
                <div class="heart-icon">
                    <i class="fas fa-heart"></i>
                </div>
                <img src="./img/${product.image}" alt="${product.Name}" class="product-image">
                <div class="product-info">
                    <h5 class="product-title">${product.Name}</h5>
                    <p class="product-price">Giá: ${product.Price} VNĐ</p>
                    <button class="cart-btn">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                </div>
            </div>
        `;
        productWrapper.innerHTML += productCard;
    });

    renderPagination();
}

function renderPagination() {
    const paginationContainer = document.querySelector("#pagination");
    paginationContainer.innerHTML = ""; 

    const totalPages = Math.ceil(allProducts.length / productsPerPage);
    
    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement("li");
        pageItem.className = `page-item ${i === currentPage ? "active" : ""}`;
        pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;

        pageItem.addEventListener("click", function (e) {
            e.preventDefault();
            currentPage = i;
            renderProducts();
        });

        paginationContainer.appendChild(pageItem);
    }
}
