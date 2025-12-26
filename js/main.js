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
    const featureCards = document.querySelectorAll('.feature-card');
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
        name: "Bamboo Water Bottle",
        price: 25.00,
        discountPrice: 19.99,
        description: "Stay hydrated with this eco-friendly, durable bamboo water bottle.",
        image: "assets/images/bottle.jpg" // Placeholder path
    },
    {
        name: "Organic Cotton Tote",
        price: 15.00,
        discountPrice: 12.50,
        description: "A sturdy, reusable tote bag made from 100% organic cotton.",
        image: "assets/images/tote.jpg"
    },
    {
        name: "Reusable Silicone Straws",
        price: 10.00,
        discountPrice: 8.00,
        description: "Set of 4 silicone straws with a cleaning brush. BPA free.",
        image: "assets/images/straws.jpg"
    },
    {
        name: "Biodegradable Phone Case",
        price: 30.00,
        discountPrice: 24.99,
        description: "Compostable phone case that protects your phone and the planet.",
        image: "assets/images/case.jpg"
    }
];

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
        card.innerHTML = `
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="description">${product.description}</p>
                <div class="price-container">
                    <span class="original-price">$${product.price.toFixed(2)}</span>
                    <span class="discount-price">$${product.discountPrice.toFixed(2)}</span>
                </div>
                <button class="btn add-to-cart" onclick="alert('Added to cart!')">Add to Cart</button>
            </div>
        `;

        container.appendChild(card);
    });
}
