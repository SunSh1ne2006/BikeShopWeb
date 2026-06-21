(function() {
    const bikes = [
        { id: 'b1', name: "Stinger Graphite", category: "Горный", price: 45990, image: "images/bike1.png" },
        { id: 'b2', name: "Urban Cruiser 300", category: "Городской", price: 32990, image: "images/bike2.png" },
        { id: 'b3', name: "Speedster Pro", category: "Шоссейный", price: 67990, image: "images/bike3.png" },
        { id: 'b4', name: "Kiddy Rocket 20", category: "Детский", price: 18990, image: "images/bike4.png" },
        { id: 'b5', name: "E-Motion Volt", category: "Электро", price: 89990, image: "images/bike5.png" },
        { id: 'b6', name: "Trail Master 29", category: "Горный", price: 52990, image: "images/bike6.png" }
    ];
    const accessories = [
        { id: 'a1', name: "Шлем Defender Pro", category: "Защита", price: 4990, image: "images/acc1.png" },
        { id: 'a2', name: "Велофара UltraBright", category: "Освещение", price: 2790, image: "images/acc2.png" },
        { id: 'a3', name: "Замок-трос SteelSafe", category: "Безопасность", price: 1590, image: "images/acc3.png" },
        { id: 'a4', name: "Бутылка Hydra 750ml", category: "Питье", price: 890, image: "images/acc4.png" },
        { id: 'a5', name: "Велокомпьютер Sigma 1200", category: "Электроника", price: 3200, image: "images/acc5.png" },
        { id: 'a6', name: "Крылья CityProtect", category: "Защита", price: 1750, image: "images/acc6.png" }
    ];
    const parts = [
        { id: 'p1', name: "Цепь Shimano HG54", category: "Трансмиссия", price: 1890, image: "images/part1.png" },
        { id: 'p2', name: "Покрышка Schwalbe 29x2.2", category: "Колёса", price: 3290, image: "images/part2.png" },
        { id: 'p3', name: "Кассета SRAM 12ск", category: "Трансмиссия", price: 5490, image: "images/part3.png" },
        { id: 'p4', name: "Тормозные колодки Avid", category: "Тормоза", price: 1350, image: "images/part4.png" },
        { id: 'p5', name: "Рулевая колонка FSA", category: "Рулевое", price: 2900, image: "images/part5.png" },
        { id: 'p6', name: "Седло Ergon SMC", category: "Седло", price: 4200, image: "images/part6.png" }
    ];

    let cart = [];

    const pageSections = {
        home: document.getElementById('home-section'),
        bikes: document.getElementById('bikes-section'),
        accessories: document.getElementById('accessories-section'),
        parts: document.getElementById('parts-section'),
        'product-detail': document.getElementById('product-detail-section'),
        cart: document.getElementById('cart-section'),
        about: document.getElementById('about-section'),
        contact: document.getElementById('contact-section')
    };

    function findProductById(id) {
        return [...bikes, ...accessories, ...parts].find(p => p.id === id);
    }

    function addToCart(productId) {
        const product = findProductById(productId);
        if (!product) return;
        const existing = cart.find(item => item.id === productId);
        if (existing) existing.quantity += 1;
        else cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
        updateCartUI();
        alert(`✅ ${product.name} добавлен в корзину!`);
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCartUI();
    }

    function changeQuantity(productId, delta) {
        const item = cart.find(i => i.id === productId);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) removeFromCart(productId);
            else updateCartUI();
        }
    }

    function updateCartUI() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cart-count').textContent = totalItems;
        if (pageSections.cart.classList.contains('active')) renderCartPage();
    }

    function renderCartPage() {
        const container = document.getElementById('cartPageContent');
        if (!container) return;
        if (cart.length === 0) {
            container.innerHTML = '<p style="text-align:center; color:#64748b; padding:40px;">Корзина пуста</p>';
            return;
        }
        let html = `<table class="cart-table"><thead><tr><th>Товар</th><th>Цена</th><th>Кол-во</th><th>Сумма</th><th></th></tr></thead><tbody>`;
        cart.forEach(item => {
            html += `<tr>
                <td>${item.name}</td>
                <td>${item.price.toLocaleString()} ₽</td>
                <td><div class="quantity-control"><button class="quantity-btn" data-id="${item.id}" data-delta="-1">−</button><span>${item.quantity}</span><button class="quantity-btn" data-id="${item.id}" data-delta="1">+</button></div></td>
                <td>${(item.price * item.quantity).toLocaleString()} ₽</td>
                <td><button class="remove-btn" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button></td>
            </tr>`;
        });
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        html += `</tbody></table><div class="cart-summary">Итого: ${total.toLocaleString()} ₽</div><button class="checkout-btn">Оформить заказ</button>`;
        container.innerHTML = html;

        container.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', () => changeQuantity(btn.dataset.id, parseInt(btn.dataset.delta)));
        });
        container.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', () => removeFromCart(btn.dataset.id));
        });
        const checkoutBtn = container.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                alert('Спасибо за заказ!');
                cart = [];
                updateCartUI();
                showPage('home');
            });
        }
    }

    function renderProductCards(container, products) {
        if (!container) return;
        container.innerHTML = products.map(p => `
            <div class="product-card">
                <img src="${p.image}" alt="${p.name}">
                <h3>${p.name}</h3>
                <div class="category">${p.category}</div>
                <div class="price">${p.price.toLocaleString()} ₽</div>
                <button class="detail-btn" data-id="${p.id}"><i class="fas fa-info-circle"></i> Подробнее</button>
                <button class="add-to-cart" data-id="${p.id}"><i class="fas fa-cart-plus"></i> В корзину</button>
            </div>
        `).join('');
        container.querySelectorAll('.detail-btn').forEach(btn => btn.addEventListener('click', () => showProductDetail(btn.dataset.id)));
        container.querySelectorAll('.add-to-cart').forEach(btn => btn.addEventListener('click', () => addToCart(btn.dataset.id)));
    }

    function showProductDetail(productId) {
        const product = findProductById(productId);
        if (!product) return;
        const container = document.getElementById('productDetailContainer');
        const images = [product.image, product.image, product.image, product.image]; // Заглушка, можно заменить на реальные
        const specs = { "Бренд": "VeloWorld", "Модель": product.name, "Тип": product.category, "Вес": "12.5 кг", "Материал": "Алюминий" };
        let stars = '';
        for (let i = 0; i < 5; i++) stars += '<i class="fas fa-star"></i>';

        container.innerHTML = `
            <button class="back-btn" id="backFromDetail"><i class="fas fa-arrow-left"></i> Назад</button>
            <div class="product-detail">
                <div class="product-gallery">
                    <img id="mainProductImage" src="${images[0]}" class="main-image" alt="${product.name}">
                    <div class="thumbnail-list">
                        ${images.map((img, idx) => `<img src="${img}" class="thumbnail ${idx===0?'active':''}" data-src="${img}">`).join('')}
                    </div>
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="category">${product.category}</div>
                    <div class="rating">${stars} 4.8 (123 отзыва)</div>
                    <div class="price">${product.price.toLocaleString()} ₽</div>
                    <p class="description">Отличный выбор для активной езды. Надёжные комплектующие и стильный дизайн.</p>
                    <table class="specs-table">${Object.entries(specs).map(([k,v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</table>
                    <button class="add-to-cart" data-id="${product.id}"><i class="fas fa-cart-plus"></i> В корзину</button>
                </div>
            </div>
        `;
        container.querySelectorAll('.thumbnail').forEach(thumb => {
            thumb.addEventListener('click', function() {
                document.getElementById('mainProductImage').src = this.dataset.src;
                container.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
        document.getElementById('backFromDetail').addEventListener('click', () => showPage('home'));
        container.querySelector('.add-to-cart').addEventListener('click', () => addToCart(product.id));
        showPage('product-detail');
    }

    function showPage(pageId) {
        Object.values(pageSections).forEach(sec => sec.classList.remove('active'));
        if (pageSections[pageId]) pageSections[pageId].classList.add('active');
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active-page', link.dataset.page === pageId);
        });
        if (pageId === 'cart') renderCartPage();
        window.scrollTo({ top: 200, behavior: 'smooth' });
    }

    // Навигация
    document.querySelectorAll('[data-page]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            showPage(el.dataset.page);
        });
    });

    // Табы на главной
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Мобильное меню
    document.getElementById('mobileMenuBtn').addEventListener('click', () => {
        document.getElementById('navLinks').classList.toggle('active');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) document.getElementById('navLinks').classList.remove('active');
        });
    });

    // Форма
    document.getElementById('contactForm').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('📩 Спасибо! Мы свяжемся с вами.');
        e.target.reset();
    });

    // Заполнение контейнеров товарами
    renderProductCards(document.getElementById('homeBikesContainer'), bikes);
    renderProductCards(document.getElementById('homeAccessoriesContainer'), accessories);
    renderProductCards(document.getElementById('homePartsContainer'), parts);
    renderProductCards(document.getElementById('bikesContainer'), bikes);
    renderProductCards(document.getElementById('accessoriesContainer'), accessories);
    renderProductCards(document.getElementById('partsContainer'), parts);

    updateCartUI();
    showPage('home');
})();