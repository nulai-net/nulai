/**
 * NULAI - GSAP Animations Controller
 * Scroll-triggered animations and interactions
 */

class AnimationController {
    constructor() {
        this.init();
    }

    init() {
        gsap.registerPlugin(ScrollTrigger);

        this.setupScrollAnimations();
        this.setupHeroAnimations();
        this.setupHorizontalScroll();
        this.setupTextSplitting();
        this.setupCounterAnimations();
    }

    setupHeroAnimations() {
        const tl = gsap.timeline({ delay: 0.3 });

        // Hero badge
        tl.from('.hero-badge', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });

        // Hero title
        tl.from('.hero-title', {
            y: 100,
            opacity: 0,
            duration: 1.2,
            ease: 'power4.out'
        }, '-=0.4');

        // Subtitle lines
        tl.from('.subtitle-line', {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out'
        }, '-=0.6');

        // Description
        tl.from('.hero-description', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.4');

        // CTA buttons
        tl.from('.hero-cta .btn', {
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'back.out(1.7)'
        }, '-=0.4');

        // Scroll indicator
        tl.from('.hero-scroll-indicator', {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.3');
    }

    setupScrollAnimations() {
        // Scroll reveal elements
        const revealElements = document.querySelectorAll('[data-scroll-reveal]');

        revealElements.forEach(el => {
            const delay = parseFloat(el.getAttribute('data-delay')) || 0;
            
            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse',
                    onEnter: () => el.classList.add('revealed')
                },
                y: 60,
                opacity: 0,
                duration: 1,
                delay: delay,
                ease: 'power3.out'
            });
        });

        // Feature cards
        gsap.from('.feature-card', {
            scrollTrigger: {
                trigger: '.features-grid',
                start: 'top 70%'
            },
            y: 80,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out'
        });

        // Diff items
        gsap.utils.toArray('.diff-item').forEach((item, index) => {
            const direction = index % 2 === 0 ? -100 : 100;

            gsap.from(item.querySelector('.diff-visual'), {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 75%'
                },
                x: direction,
                opacity: 0,
                duration: 1.2,
                ease: 'power3.out'
            });

            gsap.from(item.querySelector('.diff-content'), {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 75%'
                },
                x: -direction,
                opacity: 0,
                duration: 1.2,
                ease: 'power3.out',
                delay: 0.2
            });
        });

        // Tags
        gsap.from('.tag-floating', {
            scrollTrigger: {
                trigger: '.tags-container',
                start: 'top 70%'
            },
            scale: 0,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'back.out(1.7)'
        });

        // Stats
        gsap.from('.stat-item', {
            scrollTrigger: {
                trigger: '.stats-grid',
                start: 'top 70%'
            },
            y: 60,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out'
        });

        // FAQ items
        gsap.from('.faq-item', {
            scrollTrigger: {
                trigger: '.faq-container',
                start: 'top 70%'
            },
            x: -50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out'
        });

        // CTA section
        gsap.from('.cta-title', {
            scrollTrigger: {
                trigger: '.cta-section',
                start: 'top 70%'
            },
            scale: 0.8,
            opacity: 0,
            duration: 1,
            ease: 'back.out(1.7)'
        });

        gsap.from('.cta-form', {
            scrollTrigger: {
                trigger: '.cta-section',
                start: 'top 70%'
            },
            y: 40,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            delay: 0.3
        });
    }

    setupHorizontalScroll() {
        // DISABLED - Using vertical layout instead
        // Animate h-slides vertically
        gsap.from('.h-slide', {
            scrollTrigger: {
                trigger: '.horizontal-section',
                start: 'top 70%'
            },
            y: 80,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out'
        });
    }

    setupTextSplitting() {
        // DISABLED - was hiding content
        // Content shows immediately now
        return;
    }

    setupCounterAnimations() {
        const counters = document.querySelectorAll('[data-count]');

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2;

            ScrollTrigger.create({
                trigger: counter,
                start: 'top 80%',
                onEnter: () => {
                    gsap.to(counter, {
                        textContent: target,
                        duration: duration,
                        ease: 'power2.out',
                        snap: { textContent: 1 },
                        onUpdate: function() {
                            counter.textContent = Math.ceil(counter.textContent) + '+';
                        }
                    });
                }
            });
        });
    }
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new AnimationController();
    });
} else {
    new AnimationController();
}
