/**
 * NULAI - Custom Magnetic Cursor
 * Advanced cursor with magnetic attraction to interactive elements
 */

class MagneticCursor {
    constructor() {
        this.cursor = {
            el: document.querySelector('.cursor'),
            dot: document.querySelector('.cursor-dot'),
            outline: document.querySelector('.cursor-outline'),
            x: 0,
            y: 0,
            targetX: 0,
            targetY: 0
        };

        this.mouse = {
            x: 0,
            y: 0
        };

        this.magneticElements = [];
        this.isHovering = false;
        this.init();
    }

    init() {
        if (!this.cursor.el) return;

        // Hide default cursor on desktop
        if (window.innerWidth > 768) {
            document.body.classList.add('no-cursor');
            this.bindEvents();
            this.animate();
            this.initMagneticElements();
        }
    }

    bindEvents() {
        // Mouse move
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        // Hover effects
        const hoverElements = document.querySelectorAll('a, button, .magnetic-btn, .tag-floating, .feature-card, .faq-question');

        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.el.classList.add('hover');
                this.isHovering = true;
            });

            el.addEventListener('mouseleave', () => {
                this.cursor.el.classList.remove('hover');
                this.isHovering = false;
            });
        });
    }

    initMagneticElements() {
        const magneticEls = document.querySelectorAll('[data-magnetic]');

        magneticEls.forEach(el => {
            el.addEventListener('mousemove', (e) => this.magneticEffect(e, el));
            el.addEventListener('mouseleave', () => this.resetMagnetic(el));
        });
    }

    magneticEffect(e, el) {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) * 0.3;
        const deltaY = (e.clientY - centerY) * 0.3;

        gsap.to(el, {
            x: deltaX,
            y: deltaY,
            duration: 0.3,
            ease: 'power2.out'
        });
    }

    resetMagnetic(el) {
        gsap.to(el, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)'
        });
    }

    animate() {
        // Instant, synchronized movement for both dot and outline
        this.cursor.x += (this.mouse.x - this.cursor.x) * 1; // Instant follow
        this.cursor.y += (this.mouse.y - this.cursor.y) * 1;

        // Both use exact same transform - perfectly aligned
        const transform = `translate(-50%, -50%) translate(${this.cursor.x}px, ${this.cursor.y}px)`;
        this.cursor.dot.style.transform = transform;
        this.cursor.outline.style.transform = transform;

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new MagneticCursor();
    });
} else {
    new MagneticCursor();
}
