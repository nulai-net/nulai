/**
 * Emergency Fix - Make ALL content visible immediately
 * This overrides all hiding animations
 */

// Run as soon as possible
(function() {
    // Make everything with data-scroll-reveal visible
    document.addEventListener('DOMContentLoaded', function() {
        const elements = document.querySelectorAll('[data-scroll-reveal], .split-text, .feature-card, .diff-item, .tag-floating, .stat-item, .faq-item');

        elements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.classList.add('revealed');
        });

        console.log('✅ All content made visible!', elements.length, 'elements');
    });

    // Also run immediately for any existing elements
    setTimeout(() => {
        const elements = document.querySelectorAll('[data-scroll-reveal], .split-text, .feature-card, .diff-item, .tag-floating, .stat-item, .faq-item');

        elements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.classList.add('revealed');
        });
    }, 100);
})();
