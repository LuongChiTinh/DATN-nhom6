//sử lí tìm kiếm
document.addEventListener("DOMContentLoaded", function () {
    fetchCategories();
    fetchProducts();

    document.getElementById("searchInput").addEventListener("input", function (e) {
        const searchTerm = e.target.value.toLowerCase();
        const filteredProducts = allProducts.filter(product =>
            product.Name.toLowerCase().includes(searchTerm)
        );
        currentPage = 1;
        renderProducts(filteredProducts);
    });

    // Sự kiện sắp xếp
    const sortToggle = document.querySelector(".sort-toggle");
    const sortMenu = document.querySelector(".sort-menu");
    const sortItems = document.querySelectorAll(".sort-item");

    sortToggle.addEventListener("click", function () {
        const isOpen = sortMenu.classList.contains("open");
        sortMenu.classList.toggle("open", !isOpen);
        sortToggle.querySelector("i").classList.toggle("open", !isOpen);

        if (!isOpen) {
            document.addEventListener("click", closeMenuOutside);
        }
    });

    function closeMenuOutside(e) {
        if (!sortDropdown.contains(e.target)) {
            sortMenu.classList.remove("open");
            sortToggle.querySelector("i").classList.remove("open");
            document.removeEventListener("click", closeMenuOutside);
        }
    }

    const sortDropdown = document.querySelector(".sort-dropdown");

    sortItems.forEach(item => {
        item.addEventListener("click", function () {
            const sortType = this.getAttribute("data-sort");
            sortProducts(sortType);
            sortItems.forEach(i => i.classList.remove("active"));
            this.classList.add("active");
            sortToggle.innerHTML = `${this.textContent} <i class="fas fa-chevron-down"></i>`;
            sortMenu.classList.remove("open");
            sortToggle.querySelector("i").classList.remove("open");
        });
    });
});

const productsPerPage = 12;
let currentPage = 1;
let allProducts = [];
let allCategories = [];
let currentCategoryId = null; 

function fetchCategories() {
    fetch("http://localhost:5000/getAllCategories")
        .then(response => response.json())
        .then(data => {
            allCategories = data;
            showCategories(data);
            setupCategoryEvents(); 
        })
        .catch(error => console.error("Lỗi khi lấy danh mục:", error));
}

function showCategories(categories) {
    const categoryContainer = document.querySelector(".show-cate");
    categoryContainer.innerHTML = `<div class="category-item" data-category-id="all"><p>Tất cả</p></div>`; 

    categories.forEach(category => {
        const categoryItem = document.createElement("div");
        categoryItem.classList.add("category-item");
        categoryItem.setAttribute("data-category-id", category.Category_ID);
        categoryItem.innerHTML = `<p>${category.Category_Name}</p>`;
        categoryContainer.appendChild(categoryItem);
    });
}

function setupCategoryEvents() {
    const categoryItems = document.querySelectorAll(".category-item");
    categoryItems.forEach(item => {
        item.addEventListener("click", function () {
            const categoryId = this.getAttribute("data-category-id");
            currentCategoryId = categoryId === "all" ? null : parseInt(categoryId);
            filterProductsByCategory();
            categoryItems.forEach(i => i.classList.remove("active"));
            this.classList.add("active");
        });
    });
}

function fetchProducts() {
    fetch("http://localhost:5000/getAllProduct")
        .then(response => response.json())
        .then(data => {
            allProducts = data;
            currentPage = 1;
            renderProducts(allProducts);
        })
        .catch(error => console.error("Lỗi khi lấy sản phẩm:", error));
}

function filterProductsByCategory() {
    let filteredProducts = allProducts;
    if (currentCategoryId !== null) {
        filteredProducts = allProducts.filter(product => product.Category_ID === currentCategoryId);
    }
    currentPage = 1;
    renderProducts(filteredProducts);
}

function sortProducts(sortType) {
    let sortedProducts = currentCategoryId === null 
        ? [...allProducts] 
        : allProducts.filter(product => product.Category_ID === currentCategoryId);

    switch (sortType) {
        case "new":
            sortedProducts.sort((a, b) => new Date(b.Publication_Date) - new Date(a.Publication_Date));
            break;
        case "price-asc":
            sortedProducts.sort((a, b) => a.Price - b.Price);
            break;
        case "price-desc":
            sortedProducts.sort((a, b) => b.Price - a.Price);
            break;
    }

    currentPage = 1;
    renderProducts(sortedProducts);
}

function renderProducts(products = allProducts) {
    const productWrapper = document.querySelector(".product-wrapper");
    productWrapper.innerHTML = ""; 

    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    const productsToShow = products.slice(start, end);

    productsToShow.forEach(product => {
        const productCard = `
            <div class="product-card">
                <div class="heart-icon">
                    <i class="fas fa-heart"></i>
                </div>
                <img src="./img/${product.image}" alt="${product.Name}" class="product-image">
                <div class="product-info">
                    <h5 class="product-title">${product.Name}</h5>
                    <p class="product-author">Tác giả: ${product.Author}</p>
                    <p class="product-cover">Loại bìa: ${product.Cover_Format}</p>
                    <p class="product-price">Giá: ${product.Price} VNĐ</p>
                    <button class="cart-btn">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                </div>
            </div>
        `;
        productWrapper.innerHTML += productCard;
    });

    renderPagination(products);
}

function renderPagination(products = allProducts) {
    const paginationContainer = document.querySelector("#pagination");
    paginationContainer.innerHTML = ""; 

    const totalPages = Math.ceil(products.length / productsPerPage);
    
    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement("li");
        pageItem.className = `page-item ${i === currentPage ? "active" : ""}`;
        pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;

        pageItem.addEventListener("click", function (e) {
            e.preventDefault();
            currentPage = i;
            renderProducts(products);
        });

        paginationContainer.appendChild(pageItem);
    }
}

