

(function () {
    'use strict';

    // Price range slider
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');

    if (priceRange && priceValue) {
        priceRange.addEventListener('input', (e) => {
            priceValue.textContent = '$' + e.target.value;
        });
    }

    // Add to cart button clicks
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartCount = document.querySelector('.cart-count');

    if (addToCartButtons && cartCount) {
        let count = 0;

        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                count++;
                cartCount.textContent = count;

                // Optional: Add visual feedback
                const productCard = button.closest('.product-card');
                productCard.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    productCard.style.transform = '';
                }, 200);
            });
        });
    }

    // Show More buttons
    const showMoreButtons = document.querySelectorAll('.btn-show-more');

    showMoreButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Placeholder for show more functionality
            alert('Show more products feature coming soon!');
        });
    });

    // Category chips
    const categoryChips = document.querySelectorAll('.category-chip');

    categoryChips.forEach(chip => {
        chip.addEventListener('click', () => {
            // Remove active class from all chips
            categoryChips.forEach(c => c.classList.remove('active'));
            // Add active class to clicked chip
            chip.classList.add('active');

            // Placeholder for filter functionality
            const category = chip.querySelector('span').textContent;
            console.log('Category selected:', category);
        });
    });

})();
