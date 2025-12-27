/**
 * EcoMart Main JavaScript
 * Handles common functionality across pages.
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('EcoMart Application Loaded');

    // Highlight active navigation link
    const currentLocation = location.href;
    const menuItem = document.querySelectorAll('.nav-links a');
    const menuLength = menuItem.length;
    for (let i = 0; i < menuLength; i++) {
        // Simple check if href includes filename or empty for home
        if (menuItem[i].href === currentLocation) {
            menuItem[i].className = "active";
            menuItem[i].style.borderBottom = "2px solid #FFB74D";
        }
    }

    // --- Features Carousel Logic ---
    const featureCards = document.querySelectorAll('.feature-card, .team-card');
    if (featureCards.length > 0) {
        const dots = document.querySelectorAll('.dot');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        let currentIndex = 0;
        const totalCards = featureCards.length;

        // Function to update carousel state
        function updateCarousel() {
            featureCards.forEach((card, index) => {
                // Remove all state classes
                card.classList.remove('active', 'prev', 'next', 'sub-prev', 'sub-next');

                // Calculate difference from current index (handling wrap-around)
                let diff = (index - currentIndex + totalCards) % totalCards;
                // Adjust diff to be within -2 to +2 range for 5 items centered logic
                if (diff > totalCards / 2) diff -= totalCards;

                // Assign classes based on relative position
                if (diff === 0) {
                    card.classList.add('active');
                } else if (diff === -1) {
                    card.classList.add('prev');
                } else if (diff === 1) {
                    card.classList.add('next');
                } else if (diff < -1) {
                    card.classList.add('sub-prev'); // Hidden far left
                } else {
                    card.classList.add('sub-next'); // Hidden far right
                }
            });

            // Update Dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        // Event Listeners for Buttons
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalCards;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalCards) % totalCards;
            updateCarousel();
        });

        // Event Listeners for Dots
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                currentIndex = parseInt(dot.getAttribute('data-index'));
                updateCarousel();
            });
        });

        // Optional: Allow clicking on prev/next cards to navigate
        featureCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                let diff = (index - currentIndex + totalCards) % totalCards;
                if (diff > totalCards / 2) diff -= totalCards;

                if (diff === -1 || diff === 1) {
                    currentIndex = index;
                    updateCarousel();
                }
            });
        });

        // Initialize
        updateCarousel();
    }
    // -------------------------------


    // Check if we are on the products page
    const productGrid = document.getElementById('product-grid');
    if (productGrid) {
        renderProducts(productGrid);
    }

    // Check if we are on the contact page
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', validateForm);
    }
});

// Navigation Scroll Effect
window.addEventListener('scroll', function () {
    const nav = document.querySelector('nav');
    if (nav) {
        if (window.scrollY > 50) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }
    }
});

/**
 * Validates the contact form on submission.
 * @param {Event} e - The submit event.
 */
function validateForm(e) {
    e.preventDefault(); // Prevent actual submission

    let isValid = true;

    // Validate Name
    const nameInput = document.getElementById('name');
    const nameError = document.getElementById('nameError');
    if (nameInput.value.trim() === '') {
        isValid = false;
        showError(nameInput, nameError);
    } else {
        clearError(nameInput, nameError);
    }

    // Validate Email
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
        isValid = false;
        showError(emailInput, emailError);
    } else {
        clearError(emailInput, emailError);
    }

    // Validate Message
    const msgInput = document.getElementById('message');
    const msgError = document.getElementById('messageError');
    if (msgInput.value.trim() === '') {
        isValid = false;
        showError(msgInput, msgError);
    } else {
        clearError(msgInput, msgError);
    }

    if (isValid) {
        alert('Thank you! Your message has been sent successfully.');
        document.getElementById('contactForm').reset();
    }
}

/**
 * Helper to show error styling
 */
function showError(input, errorMsg) {
    input.classList.add('input-error');
    errorMsg.style.display = 'block';
}

/**
 * Helper to clear error styling
 */
function clearError(input, errorMsg) {
    input.classList.remove('input-error');
    errorMsg.style.display = 'none';
}


/**
 * Array of product objects containing details for the store.
 */
const products = [
    {
        name: "Hemp Bag",
        price: 35.00,
        discountPrice: 29.99,
        description: "Durable, eco-friendly hemp bag perfect for daily use.",
        image: "Assets/hemp bag.PNG"
    },
    {
        name: "Hemp Shoes",
        price: 55.00,
        discountPrice: 48.00,
        description: "Comfortable, breathable, and sustainable footwear.",
        image: "Assets/hemp shoes.PNG"
    },
    {
        name: "Wooden Toothbrush",
        price: 6.00,
        discountPrice: 4.50,
        description: "Biodegradable bamboo toothbrush with soft bristles.",
        image: "Assets/toothbrush.PNG"
    },
    {
        name: "Eco Toilet Paper",
        price: 18.00,
        discountPrice: 15.00,
        description: "100% recycled paper, plastic-free packaging.",
        image: "Assets/toilet papers.PNG"
    },
    {
        name: "Bamboo Bottles",
        price: 28.00,
        discountPrice: 24.00,
        description: "Insulated bamboo water bottle, stylish and functional.",
        image: "Assets/bambo bottles.PNG"
    },
    {
        name: "Wooden Compost Bin",
        price: 65.00,
        discountPrice: 55.00,
        description: "Compact wooden bin for odorless home composting.",
        image: "Assets/compost bins.jpg"
    }
];

// --- Cart Logic ---
let cartCount = 0;

function updateCartCount() {
    const countElement = document.getElementById('cartCount');
    if (countElement) {
        countElement.textContent = cartCount;

        // Optional: Animate badge
        countElement.style.transform = "scale(1.2)";
        setTimeout(() => {
            countElement.style.transform = "scale(1)";
        }, 200);
    }
}

function addToCart() {
    cartCount++;
    updateCartCount();
    // No alert per user request details (implied by just "increases by one"), but keeping user feedback is good.
    // I'll make the button text change temporarily or just rely on the counter.
}
// ------------------

/**
 * Function to render products dynamically into the DOM.
 * @param {HTMLElement} container - The container element to append products to.
 */
function renderProducts(container) {
    container.innerHTML = ''; // Clear existing content

    products.forEach(product => {
        // Create product card div
        const card = document.createElement('div');
        card.className = 'product-card';

        // Inner HTML template for the product
        // Updated onclick to call addToCart()
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="description">${product.description}</p>
                <div class="price-container">
                    <span class="original-price">$${product.price.toFixed(2)}</span>
                    <span class="discount-price">$${product.discountPrice.toFixed(2)}</span>
                </div>
                <button class="btn add-to-cart" onclick="addToCart()">Add to Cart</button>
            </div>
        `;

        container.appendChild(card);
    });
}
