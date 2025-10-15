/**
 * NULAI - Main Application Controller
 * Coordinates all interactions and features
 */

class NULAIApp {
    constructor() {
        this.loadingScreen = document.querySelector('.loading-screen');
        this.noiseCanvas = document.getElementById('noise-canvas');

        this.init();
    }

    init() {
        this.createNoiseTexture();
        this.initLoadingSequence();
        this.initSmoothScroll();
        this.initFAQ();
        this.initFormHandling();
        this.initScrollIndicator();
        this.initNavigation();
    }

    // ===== LOADING SEQUENCE =====
    initLoadingSequence() {
        // Instant load - no loading screen
        if (this.loadingScreen) {
            this.loadingScreen.style.display = 'none';
        }
        document.body.style.overflow = 'visible';
    }

    completeLoading() {
        // Not needed anymore
    }

    // ===== NOISE TEXTURE =====
    createNoiseTexture() {
        if (!this.noiseCanvas) return;

        const ctx = this.noiseCanvas.getContext('2d');
        this.noiseCanvas.width = window.innerWidth;
        this.noiseCanvas.height = window.innerHeight;

        const imageData = ctx.createImageData(this.noiseCanvas.width, this.noiseCanvas.height);
        const buffer = new Uint32Array(imageData.data.buffer);

        for (let i = 0; i < buffer.length; i++) {
            if (Math.random() < 0.5) {
                buffer[i] = 0xff000000;
            }
        }

        ctx.putImageData(imageData, 0, 0);

        // Resize handler
        window.addEventListener('resize', () => {
            this.noiseCanvas.width = window.innerWidth;
            this.noiseCanvas.height = window.innerHeight;
            this.createNoiseTexture();
        });
    }

    // ===== SMOOTH SCROLL =====
    initSmoothScroll() {
        // Simplified - use native smooth scroll for better performance
        document.documentElement.style.scrollBehavior = 'smooth';
    }

    // ===== FAQ ACCORDION =====
    initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // If clicking on already active item, just close it
                if (isActive) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    setTimeout(() => {
                        item.classList.remove('active');
                        question.setAttribute('aria-expanded', 'false');
                        gsap.to(answer, {
                            maxHeight: 0,
                            paddingTop: 0,
                            duration: 0.35,
                            ease: 'power2.inOut'
                        });
                    }, 10);
                    return;
                }

                // Close all open FAQs first, then open the new one
                const openFaqs = Array.from(faqItems).filter(faq => faq.classList.contains('active'));
                
                if (openFaqs.length > 0) {
                    openFaqs.forEach(faq => {
                        const faqAnswer = faq.querySelector('.faq-answer');
                        faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
                        
                        setTimeout(() => {
                            faq.classList.remove('active');
                            faq.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                            
                            gsap.to(faqAnswer, {
                                maxHeight: 0,
                                paddingTop: 0,
                                duration: 0.35,
                                ease: 'power2.inOut',
                                onComplete: () => {
                                    // Open the new FAQ after close completes
                                    if (faq === openFaqs[openFaqs.length - 1]) {
                                        openNewFaq();
                                    }
                                }
                            });
                        }, 10);
                    });
                } else {
                    // No FAQs open, just open this one
                    openNewFaq();
                }

                function openNewFaq() {
                    item.classList.add('active');
                    question.setAttribute('aria-expanded', 'true');
                    
                    const contentHeight = answer.scrollHeight;
                    gsap.to(answer, {
                        maxHeight: contentHeight + 100,
                        duration: 0.35,
                        ease: 'power2.inOut',
                        onComplete: () => {
                            answer.style.maxHeight = 'none';
                        }
                    });
                }
            });

            // Keyboard support
            question.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
            });
        });
    }

    // ===== FORM HANDLING =====
    initFormHandling() {
        const form = document.getElementById('beta-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = form.querySelector('input[type="email"]').value;
            const button = form.querySelector('button[type="submit"]');
            const originalHTML = button.innerHTML;

            // Animate button
            gsap.to(button, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1
            });

            // Simulate submission
            button.innerHTML = '<span class="btn-text">Submitting...</span>';
            button.disabled = true;

            setTimeout(() => {
                button.innerHTML = '<span class="btn-text">✓ You\'re on the list!</span>';

                gsap.to(button, {
                    backgroundColor: '#4CAF50',
                    duration: 0.3
                });

                // Reset after 3 seconds
                setTimeout(() => {
                    button.innerHTML = originalHTML;
                    button.disabled = false;
                    form.reset();
                    gsap.to(button, {
                        backgroundColor: '',
                        duration: 0.3
                    });
                }, 3000);

                // Here you would actually send the email to your backend
                console.log('Email submitted:', email);
            }, 1500);
        });
    }

    // ===== SCROLL INDICATOR =====
    initScrollIndicator() {
        const indicator = document.querySelector('.hero-scroll-indicator');
        if (!indicator) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled > 100) {
                gsap.to(indicator, {
                    opacity: 0,
                    duration: 0.3
                });
            } else {
                gsap.to(indicator, {
                    opacity: 1,
                    duration: 0.3
                });
            }
        });
    }

    // ===== SMOOTH SCROLL TO SECTION =====
    initNavigation() {
        const scrollButtons = document.querySelectorAll('[data-scroll-to]');

        scrollButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const target = button.getAttribute('data-scroll-to');
                const element = document.querySelector(target);

                if (element) {
                    element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ===== UTILITY FUNCTIONS =====

// Detect if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Lerp (Linear interpolation)
function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

// Map range
function mapRange(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

// Clamp value
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// Random range
function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

// ===== INITIALIZE APPLICATION =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new NULAIApp();
    });
} else {
    new NULAIApp();
}

// ===== PERFORMANCE MONITORING (DEV) =====
if (window.location.hostname === 'localhost') {
    let fps = 0;
    let lastTime = performance.now();

    function measureFPS() {
        const currentTime = performance.now();
        fps = Math.round(1000 / (currentTime - lastTime));
        lastTime = currentTime;
        requestAnimationFrame(measureFPS);
    }

    measureFPS();

    // Log FPS every 2 seconds
    setInterval(() => {
        if (fps < 50) {
            console.warn(`⚠️ Low FPS: ${fps}`);
        }
    }, 2000);
}

// ===== EASTER EGG =====
console.log(
    '%c NULAI ',
    'background: linear-gradient(135deg, #FF6B35, #FFA726); color: #0a0a0a; font-size: 24px; font-weight: bold; padding: 10px 20px; border-radius: 8px;'
);
console.log(
    '%c The Future of Video Editing ',
    'color: #FF6B35; font-size: 14px; font-weight: 600;'
);
console.log('%c Built with ❤️ and cutting-edge web technologies', 'color: #999; font-size: 12px;');
