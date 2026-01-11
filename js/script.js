/* 
  ========================================
  ECOMART - JAVASCRIPT LOGIC
  ========================================
*/

// --- PRODUCT DATA ---
const products = [
    {
        id: 1,
        name: "Bamboo Toothbrush",
        price: 5.99,
        category: "Personal Care",
        image: "https://placehold.co/300x200/e8f5e9/2d5f3f?text=Bamboo+Toothbrush",
        badge: "Best Seller"
    },
    {
        id: 2,
        name: "Reusable Bottle",
        price: 12.99,
        category: "Home & Living",
        image: "https://placehold.co/300x200/e8f5e9/2d5f3f?text=Reusable+Bottle",
        badge: "New"
    },
    {
        id: 3,
        name: "Organic Cotton Bag",
        price: 8.50,
        category: "Home & Living",
        image: "https://placehold.co/300x200/e8f5e9/2d5f3f?text=Cotton+Bag",
        badge: "Sale"
    },
    {
        id: 4,
        name: "Beeswax Wrap",
        price: 9.99,
        category: "Home & Living",
        image: "https://placehold.co/300x200/e8f5e9/2d5f3f?text=Beeswax+Wrap"
    },
    {
        id: 5,
        name: "Eco Starter Kit",
        price: 24.99,
        category: "Bundles",
        image: "https://placehold.co/300x200/e8f5e9/2d5f3f?text=Starter+Kit"
    },
    {
        id: 6,
        name: "Recycled Notebook",
        price: 4.99,
        category: "Stationery",
        image: "https://placehold.co/300x200/e8f5e9/2d5f3f?text=Notebook"
    },
    {
        id: 7,
        name: "Glass Straw Set",
        price: 6.99,
        category: "Home & Living",
        image: "https://placehold.co/300x200/e8f5e9/2d5f3f?text=Glass+Straws"
    },
    {
        id: 8,
        name: "Solar Power Bank",
        price: 29.99,
        category: "Gadgets",
        image: "https://placehold.co/300x200/e8f5e9/2d5f3f?text=Solar+Bank"
    },
    {
        id: 9,
        name: "Hemp T-Shirt",
        price: 19.99,
        category: "Fashion",
        image: "https://placehold.co/300x200/e8f5e9/2d5f3f?text=Hemp+T-Shirt"
    },
    {
        id: 10,
        name: "Biodegradable Phone Case",
        price: 14.50,
        category: "Gadgets",
        image: "https://placehold.co/300x200/e8f5e9/2d5f3f?text=Phone+Case"
    }
];

// --- STATE MANAGEMENT ---
const state = {
    cartCount: 0,
    cartTotal: 0,
    cartItems: [], // Array of {id, name, price, quantity, image}
    visibleProducts: 8, // Initial number of products to show in grid
    currentCategory: 'All Categories'
};

// --- DOM ELEMENTS REFERENCE ---
const dom = {
    searchInputs: () => document.querySelectorAll('input[type="text"]'),
    searchResults: () => document.querySelector('.search-results-dropdown'),
    cartBadge: () => document.querySelector('.cart-badge'),
    productGrid: () => document.querySelector('.product-grid'),
    showMoreBtn: () => document.querySelector('.btn-show-more'),
    categoryTabs: () => document.querySelectorAll('.category-tabs a'),
    modalOverlay: () => document.querySelector('.modal-overlay'),
    loginModal: () => document.getElementById('login-modal'),
    cartModal: () => document.getElementById('cart-modal')
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    setupEventListeners();
    updateCartDisplay();
});

// --- CORE FUNCTIONS ---

// 1. Render Products to Grid
function renderProducts(filter = 'All Categories') {
    const bestDealsGrid = document.getElementById('best-deals-grid');
    const justForYouGrid = document.getElementById('just-for-you-grid');

    // Clear both
    if (bestDealsGrid) bestDealsGrid.innerHTML = '';
    if (justForYouGrid) justForYouGrid.innerHTML = '';

    let filteredProducts = products;
    if (filter !== 'All Categories') {
        filteredProducts = products.filter(p => p.category.includes(filter) || filter === 'All Categories');
    }

    // Populate Best Deals (first 4 items for example)
    if (bestDealsGrid) {
        filteredProducts.slice(0, 4).forEach((product) => {
            createProductCard(product, bestDealsGrid);
        });
    }

    // Populate Just For You (remaining or all?)
    // Let's show specific set or shuffled. For now, showing the rest or same set to fill.
    if (justForYouGrid) {
        filteredProducts.slice(0, state.visibleProducts).forEach((product) => {
            createProductCard(product, justForYouGrid);
        });
    }

    // Hide "Show More" if all products are shown
    if (dom.showMoreBtn()) {
        dom.showMoreBtn().style.display = (state.visibleProducts >= filteredProducts.length) ? 'none' : 'block';
    }
}

function createProductCard(product, container) {
    const card = document.createElement('div');
    card.className = 'product-card animate-in';
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-details">
            <div class="product-tags">${product.category}</div>
            <h3 class="product-title">${product.name}</h3>
            <div class="product-price">
                $${product.price.toFixed(2)}
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})" title="Add to Cart">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        </div>
    `;
    container.appendChild(card);
}

// 2. Search Functionality
function setupSearch() {
    const searchInput = document.querySelector('.search-wide input');

    if (!searchInput) return;

    let dropdown = document.querySelector('.search-dropdown');
    if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.className = 'search-dropdown';
        document.querySelector('.search-wide').appendChild(dropdown);
    }

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (query.length < 1) {
            dropdown.style.display = 'none';
            return;
        }

        const matches = products.filter(p => p.name.toLowerCase().includes(query));
        renderSearchDropdown(matches, dropdown);
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-wide')) {
            dropdown.style.display = 'none';
        }
    });
}

function renderSearchDropdown(matches, container) {
    if (matches.length === 0) {
        container.innerHTML = '<div class="search-item no-result">No products found</div>';
    } else {
        container.innerHTML = matches.map(p => `
            <div class="search-item" onclick="scrollToProduct(${p.id})">
                <img src="${p.image}" alt="thumb">
                <div class="search-info">
                    <strong>${p.name}</strong>
                    <span>$${p.price.toFixed(2)}</span>
                </div>
            </div>
        `).join('');
    }
    container.style.display = 'block';
}

function scrollToProduct(id) {
    const grid = dom.productGrid();
    if (grid) {
        const product = products.find(p => p.id === id);
        if (product) {
            grid.scrollIntoView({ behavior: 'smooth' });
            alert(`Navigating to ${product.name}...`);
        }
    }
}

// 3. Cart & User Interactions
function addToCart(id, event) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    // Check if item already in cart
    const existingItem = state.cartItems.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        state.cartItems.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image
        });
    }

    // Update totals
    state.cartCount = state.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    state.cartTotal = state.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    updateCartDisplay();

    // Visual Feedback on button
    const btn = event ? event.currentTarget : window.event?.currentTarget;
    if (btn) {
        btn.innerHTML = `<i class="fas fa-check"></i> ADDED!`;
        btn.classList.add('added');
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = `<i class="fas fa-plus"></i>`;
            btn.classList.remove('added');
            btn.disabled = false;
        }, 2000);
    }
}

function updateCartDisplay() {
    const badge = document.querySelector('.cart-count');
    const totalEl = document.querySelector('.cart-total');

    if (badge) {
        badge.innerText = state.cartCount;
        badge.style.display = state.cartCount > 0 ? 'flex' : 'none';
    }

    if (totalEl) {
        totalEl.innerText = '$' + (state.cartTotal || 0).toFixed(2);
        totalEl.style.display = state.cartCount > 0 ? 'block' : 'none';
    }
}

// 4. Navbar & Event Listeners
function setupEventListeners() {
    setupSearch();

    // Show More Button
    const showMoreBtn = dom.showMoreBtn();
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', () => {
            if (showMoreBtn.innerText === 'Show More') {
                state.visibleProducts += 8; // Show 8 more or all
                // Could also just show all: state.visibleProducts = products.length;
                renderProducts();

                // If we've reached the end/all products, change to "Show Less"
                // Or if we want strictly toggle behavior:
                // For now, let's say if we are showing all, toggle text
                if (state.visibleProducts >= products.length) {
                    showMoreBtn.innerText = 'Show Less';
                    state.visibleProducts = products.length; // Cap it
                }
            } else {
                // "Show Less" clicked
                state.visibleProducts = 8; // Reset to initial count
                showMoreBtn.innerText = 'Show More';
                renderProducts();

                // Optionally scroll back up to the start of the grid
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Category Tabs
    dom.categoryTabs().forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            dom.categoryTabs().forEach(t => t.style.color = '#555');
            e.target.style.color = '#6b9e78';

            const cat = e.target.innerText;
            state.currentCategory = cat;
            state.visibleProducts = 8;
            renderProducts(cat);
        });
    });

    // Navbar Actions
    const signInBtn = document.querySelector('.btn-signin');
    const cartIcon = document.querySelector('.fa-shopping-cart')?.parentElement;

    if (signInBtn) {
        signInBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleModal('login-modal');
        });
    }

    // Cart Icon - Show Modal
    const cartLink = document.getElementById('cart-link');
    if (cartLink) {
        cartLink.addEventListener('click', (e) => {
            e.preventDefault();
            showCartModal();
        });
    }

    // Top Right Search Icon
    const searchIconTrigger = document.querySelector('.nav-right .fa-search');
    if (searchIconTrigger) {
        searchIconTrigger.parentElement.addEventListener('click', (e) => {
            e.preventDefault();
            const searchInput = document.querySelector('.search-wide input');
            if (searchInput) {
                searchInput.focus();
                searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                searchInput.parentElement.classList.add('highlight');
                setTimeout(() => searchInput.parentElement.classList.remove('highlight'), 1000);
            }
        });
    }

    // Main Navigation Links
    document.querySelectorAll('.nav-left a').forEach(link => {
        link.addEventListener('click', (e) => {
            // Remove preventDefault to allow hashtag links to work (like #about-carousel)
            const text = link.querySelector('span')?.innerText || link.innerText;
            if (text === 'Home') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (text === 'Services') {
                e.preventDefault();
                alert('Services page coming soon!');
            }
            // For About Us and Blog (id links), let default behavior happen
        });
    });

    // Close Modals
    document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
        el.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
            document.querySelector('.modal-overlay').classList.remove('active');
        });
    });
}

function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.querySelector('.modal-overlay');
    if (modal && overlay) {
        modal.classList.add('active');
        overlay.classList.add('active');
    } else {
        alert('Feature coming soon!');
    }
}

// === AUTHENTICATION LOGIC ===

function handleLogin(e) {
    e.preventDefault();
    const name = document.getElementById('login-name').value;
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;

    // Validation
    if (email === 'ecomart5@gmail.com' && pass === 'eco123') {
        // Success
        state.currentUser = { name: name, email: email };
        localStorage.setItem('ecoUser', JSON.stringify(state.currentUser));

        updateNavbarProfile();

        // Close modal
        document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
        document.querySelector('.modal-overlay').classList.remove('active');

        alert(`Login Successful! Welcome, ${name}.`);
    } else {
        // Failure
        alert('Invalid email or password. Please try again.');
    }
}

function updateNavbarProfile() {
    const user = state.currentUser || JSON.parse(localStorage.getItem('ecoUser'));

    if (user) {
        state.currentUser = user; // Sync state
        const navRight = document.querySelector('.nav-right');

        // Hide existing "Sign In" button
        const signInBtn = navRight.querySelector('.btn-signin');
        if (signInBtn) {
            signInBtn.style.display = 'none';
        }

        // Add Profile UI if not exists
        if (!document.querySelector('.user-profile')) {
            const profileHTML = `
                <div class="user-profile" style="display:flex;align-items:center;gap:10px;cursor:pointer;margin-left:10px;" onclick="logout()" title="Click to Logout">
                    <div style="width:35px;height:35px;background:#6b9e78;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:16px;">
                        ${user.name.charAt(0).toUpperCase()}
                    </div>
                    <span style="font-weight:600;color:#333;">Hi, ${user.name}</span>
                </div>
            `;
            navRight.insertAdjacentHTML('beforeend', profileHTML);
        }
    }
}

function logout() {
    if (confirm('Do you want to logout?')) {
        localStorage.removeItem('ecoUser');
        state.currentUser = null;
        window.location.reload();
    }
}

// Initialize Auth State on Load
document.addEventListener('DOMContentLoaded', updateNavbarProfile);

// === CART MODAL FUNCTIONS ===
function showCartModal() {
    renderCartModal();
    toggleModal('cart-modal');
}

function renderCartModal() {
    const cartList = document.getElementById('cart-items-list');
    const totalItemsEl = document.getElementById('cart-total-items');
    const modalTotalEl = document.getElementById('cart-modal-total');

    if (!cartList) return;

    // Clear existing content
    cartList.innerHTML = '';

    // If cart is empty
    if (state.cartItems.length === 0) {
        cartList.innerHTML = `
            <div class="cart-empty-message">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        if (totalItemsEl) totalItemsEl.innerText = '0';
        if (modalTotalEl) modalTotalEl.innerText = '$0.00';
        return;
    }

    // Render each cart item
    state.cartItems.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-meta">
                    <span class="cart-item-qty">Qty: ${item.quantity}</span>
                    <span class="cart-item-price">$${item.price.toFixed(2)} each</span>
                </div>
            </div>
        `;
        cartList.appendChild(cartItem);
    });

    // Update totals
    if (totalItemsEl) totalItemsEl.innerText = state.cartCount;
    if (modalTotalEl) modalTotalEl.innerText = '$' + state.cartTotal.toFixed(2);
}

/* === ABOUT CAROUSEL LOGIC === */
const aboutProfiles = [
    {
        name: "Elena Rodriguez",
        role: "Founder & CEO",
        desc: "Elena started EcoMart with a vision to make sustainable living accessible to everyone. She oversees the company's mission and growth strategies.",
        img: ""
    },
    {
        name: "Liam Chen",
        role: "Head of Sustainability",
        desc: "Liam ensures that every product we sell meets our strict environmental standards. He manages our supplier relationships and green certifications.",
        img: ""
    },
    {
        name: "Sophia Patel",
        role: "Creative Director",
        desc: "Sophia leads our design team, creating the beautiful, minimalist aesthetic that defines our brand and product packaging.",
        img: ""
    },
    {
        name: "Marcus Johnson",
        role: "Community Manager",
        desc: "Marcus builds bridges with our local and global communities, managing our outreach programs and educational workshops.",
        img: ""
    },
    {
        name: "Olivia Thorne",
        role: "Tech Lead",
        desc: "Olivia drives our digital innovation, ensuring our digital carbon footprint remains as low as possible.",
        img: ""
    }
];

let currentAboutIndex = 2; // Start in middle

function initAboutCarousel() {
    updateAboutCarousel();

    // Wheel event for scrolling
    const container = document.getElementById('about-carousel');
    if (container) {
        container.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (!isScrolling) {
                if (e.deltaY > 0) moveAboutCarousel(1);
                else moveAboutCarousel(-1);
            }
        }, { passive: false });
    }
}

// Global debounce for scroll
let isScrolling = false;
function moveAboutCarousel(direction) {
    if (isScrolling) return;
    isScrolling = true;

    let newIndex = currentAboutIndex + direction;
    if (newIndex < 0) newIndex = aboutProfiles.length - 1;
    if (newIndex >= aboutProfiles.length) newIndex = 0;

    setAboutActive(newIndex);

    setTimeout(() => isScrolling = false, 400);
}

function setAboutActive(index) {
    currentAboutIndex = index;
    updateAboutCarousel();
}

function updateAboutCarousel() {
    const cards = document.querySelectorAll('.about-card-3d');
    const details = document.querySelector('.about-details');

    if (!cards.length) return;

    // Update Cards
    cards.forEach(card => {
        const cardIndex = parseInt(card.getAttribute('data-index'));
        card.className = 'about-card-3d'; // Reset classes

        let diff = (cardIndex - currentAboutIndex + 5) % 5;
        if (diff > 2) diff -= 5;

        if (diff === 0) card.classList.add('active');
        else if (diff === -1) card.classList.add('prev-1');
        else if (diff === 1) card.classList.add('next-1');
        else if (diff === -2) card.classList.add('prev-2');
        else if (diff === 2) card.classList.add('next-2');
    });

    // Update Details with Fade
    if (details) {
        details.classList.add('fade-out');
        setTimeout(() => {
            const profile = aboutProfiles[currentAboutIndex];
            const nameEl = document.getElementById('about-name');
            const roleEl = document.getElementById('about-role');
            const descEl = document.getElementById('about-desc');

            if (nameEl) nameEl.innerText = profile.name;
            if (roleEl) roleEl.innerText = profile.role;
            if (descEl) descEl.innerText = profile.desc;

            details.classList.remove('fade-out');
        }, 300);
    }
}

// Ensure init runs
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAboutCarousel);
} else {
    initAboutCarousel();
}
