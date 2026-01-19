
(function () {
  'use strict';

  // Carousel state
  let currentSlide = 0;

  // Get DOM elements
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');

  if (slides.length === 0) return; // Exit if no carousel found

  // Function to show a specific slide
  function showSlide(index) {
    // Wrap around if out of bounds
    if (index >= slides.length) {
      currentSlide = 0;
    } else if (index < 0) {
      currentSlide = slides.length - 1;
    } else {
      currentSlide = index;
    }

    // Update slides
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentSlide);
    });

    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  // Function to go to next slide
  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  // Function to go to previous slide
  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  // Event listeners
  if (nextBtn) {
    nextBtn.addEventListener('click', nextSlide);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', prevSlide);
  }

  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
    });
  });

  // Initialize: show first slide
  showSlide(0);
})();
