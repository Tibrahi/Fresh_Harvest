// Process section animation
const processItems = document.querySelectorAll('.process-item');
let currentIndex = 0;

function animateProcessItems() {
    if (currentIndex < processItems.length) {
        processItems[currentIndex].classList.add('animate');
        currentIndex++;
        setTimeout(animateProcessItems, 500); // Delay between each item
    }
}

// Start animation when process section is in view
const processSection = document.querySelector('.process-container');
const processObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateProcessItems();
            processObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

if (processSection) {
    processObserver.observe(processSection);
}

// Promotional banner animation
const promoBanner = document.querySelector('.promo-banner');
const promoTrack = document.querySelector('.promo-track');

if (promoBanner && promoTrack) {
    // Clone items for infinite scroll
    const items = promoTrack.querySelectorAll('.promo-item');
    items.forEach(item => {
        const clone = item.cloneNode(true);
        promoTrack.appendChild(clone);
    });

    // Pause animation on hover
    promoBanner.addEventListener('mouseenter', () => {
        promoTrack.style.animationPlayState = 'paused';
    });

    promoBanner.addEventListener('mouseleave', () => {
        promoTrack.style.animationPlayState = 'running';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease',
        once: true
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                }
            }
        });
    });

    // Parallax effect for hero section
    const parallaxBg = document.querySelector('.parallax-bg');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        parallaxBg.style.transform = `translateY(${scrolled * 0.5}px)`;
    });

    // Add animation to feature cards on hover
    const featureCards = document.querySelectorAll('.feature-card');

    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Form submission handling
    const subscribeForm = document.querySelector('.subscribe-form');

    subscribeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = subscribeForm.querySelector('input[type="email"]');
        const email = emailInput.value;
        
        // Here you would typically send the email to your backend
        console.log('Subscribing email:', email);
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Thank you for subscribing!';
        successMessage.style.color = 'var(--primary-color)';
        successMessage.style.marginTop = '1rem';
        
        subscribeForm.appendChild(successMessage);
        emailInput.value = '';
        
        // Remove success message after 3 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 3000);
    });

    // Add loading animation to buttons
    const buttons = document.querySelectorAll('button, .primary-button, .secondary-button');

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (!this.classList.contains('no-loading')) {
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 1000);
            }
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .web-dev-card').forEach(card => {
        observer.observe(card);
    });

    // Carousel functionality
    const carousel = {
        track: document.querySelector('.carousel-track'),
        slides: document.querySelectorAll('.carousel-slide'),
        indicators: document.querySelectorAll('.indicator'),
        prevBtn: document.querySelector('.carousel-prev'),
        nextBtn: document.querySelector('.carousel-next'),
        currentIndex: 0,
        interval: null,
        isAnimating: false,
        touchStartX: 0,
        touchEndX: 0,

        init() {
            this.setupControls();
            this.setupTouchEvents();
            this.startAutoSlide();
        },

        setupControls() {
            this.prevBtn.addEventListener('click', () => this.slide('prev'));
            this.nextBtn.addEventListener('click', () => this.slide('next'));
            
            this.indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => this.goToSlide(index));
            });

            // Pause auto-slide on hover
            this.track.addEventListener('mouseenter', () => this.stopAutoSlide());
            this.track.addEventListener('mouseleave', () => this.startAutoSlide());
        },

        setupTouchEvents() {
            this.track.addEventListener('touchstart', (e) => {
                this.touchStartX = e.touches[0].clientX;
                this.stopAutoSlide();
            });

            this.track.addEventListener('touchmove', (e) => {
                this.touchEndX = e.touches[0].clientX;
            });

            this.track.addEventListener('touchend', () => {
                const diff = this.touchStartX - this.touchEndX;
                if (Math.abs(diff) > 50) { // Minimum swipe distance
                    if (diff > 0) {
                        this.slide('next');
                    } else {
                        this.slide('prev');
                    }
                }
                this.startAutoSlide();
            });
        },

        slide(direction) {
            if (this.isAnimating) return;
            this.isAnimating = true;
            this.stopAutoSlide();
            
            const oldIndex = this.currentIndex;
            if (direction === 'next') {
                this.currentIndex = (this.currentIndex + 1) % this.slides.length;
            } else {
                this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
            }

            this.updateSlides(oldIndex);
            
            // Reset animation flag after transition
            setTimeout(() => {
                this.isAnimating = false;
                this.startAutoSlide();
            }, 800);
        },

        goToSlide(index) {
            if (this.isAnimating || index === this.currentIndex) return;
            this.isAnimating = true;
            this.stopAutoSlide();
            
            const oldIndex = this.currentIndex;
            this.currentIndex = index;
            this.updateSlides(oldIndex);
            
            setTimeout(() => {
                this.isAnimating = false;
                this.startAutoSlide();
            }, 800);
        },

        updateSlides(oldIndex) {
            this.slides[oldIndex].classList.remove('active');
            this.indicators[oldIndex].classList.remove('active');
            
            this.slides[this.currentIndex].classList.add('active');
            this.indicators[this.currentIndex].classList.add('active');
        },

        startAutoSlide() {
            this.interval = setInterval(() => this.slide('next'), 5000);
        },

        stopAutoSlide() {
            clearInterval(this.interval);
        }
    };

    // Initialize carousel when DOM is loaded
    carousel.init();
}); 