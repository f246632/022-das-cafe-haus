// ====================================
// Gallery & Lightbox JavaScript
// ====================================

// Gallery images data
const galleryImages = [
    {
        src: 'images/optimized/exterior-facade-day.jpg',
        alt: 'Das Cafe Haus exterior facade with yellow building'
    },
    {
        src: 'images/optimized/interior-dining-area-1.jpg',
        alt: 'Cozy interior dining area with wooden furniture'
    },
    {
        src: 'images/optimized/breakfast-platter.jpg',
        alt: 'Turkish breakfast platter with fresh ingredients'
    },
    {
        src: 'images/optimized/exterior-entrance-night.jpg',
        alt: 'Evening storefront with warm lighting'
    },
    {
        src: 'images/optimized/dessert-cake-latte.jpg',
        alt: 'Delicious cake slice with latte macchiato'
    },
    {
        src: 'images/optimized/interior-dining-area-2.jpg',
        alt: 'Comfortable booth seating area'
    },
    {
        src: 'images/optimized/dessert-coffee-icecream.jpg',
        alt: 'Cappuccino with ice cream and wafer'
    },
    {
        src: 'images/optimized/storefront-display-pastries.jpg',
        alt: 'Display case with fresh pastries'
    },
    {
        src: 'images/optimized/interior-seating-corner.jpg',
        alt: 'Corner seating area with mirrors'
    }
];

// Lightbox functionality
class Lightbox {
    constructor() {
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImage = document.getElementById('lightbox-image');
        this.lightboxCounter = document.querySelector('.lightbox-counter');
        this.closeBtn = document.querySelector('.lightbox-close');
        this.prevBtn = document.querySelector('.lightbox-prev');
        this.nextBtn = document.querySelector('.lightbox-next');
        this.currentIndex = 0;

        this.init();
    }

    init() {
        // Gallery item click handlers
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => this.open(index));

            // Keyboard navigation for gallery items
            item.setAttribute('tabindex', '0');
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.open(index);
                }
            });
        });

        // Lightbox controls
        this.closeBtn.addEventListener('click', () => this.close());
        this.prevBtn.addEventListener('click', () => this.navigate(-1));
        this.nextBtn.addEventListener('click', () => this.navigate(1));

        // Close on background click
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.close();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.lightbox.classList.contains('active')) return;

            switch(e.key) {
                case 'Escape':
                    this.close();
                    break;
                case 'ArrowLeft':
                    this.navigate(-1);
                    break;
                case 'ArrowRight':
                    this.navigate(1);
                    break;
            }
        });

        // Touch/swipe support for mobile
        this.addTouchSupport();
    }

    open(index) {
        this.currentIndex = index;
        this.updateImage();
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus trap in lightbox
        this.closeBtn.focus();
    }

    close() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    navigate(direction) {
        this.currentIndex += direction;

        // Loop around
        if (this.currentIndex < 0) {
            this.currentIndex = galleryImages.length - 1;
        } else if (this.currentIndex >= galleryImages.length) {
            this.currentIndex = 0;
        }

        this.updateImage();
    }

    updateImage() {
        const image = galleryImages[this.currentIndex];
        this.lightboxImage.src = image.src;
        this.lightboxImage.alt = image.alt;
        this.lightboxCounter.textContent = `${this.currentIndex + 1} / ${galleryImages.length}`;

        // Add fade transition
        this.lightboxImage.style.opacity = '0';
        setTimeout(() => {
            this.lightboxImage.style.opacity = '1';
        }, 50);

        // Preload next and previous images
        this.preloadImages();
    }

    preloadImages() {
        const preloadIndexes = [
            (this.currentIndex + 1) % galleryImages.length,
            (this.currentIndex - 1 + galleryImages.length) % galleryImages.length
        ];

        preloadIndexes.forEach(index => {
            const img = new Image();
            img.src = galleryImages[index].src;
        });
    }

    addTouchSupport() {
        let touchStartX = 0;
        let touchEndX = 0;

        this.lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        this.lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });

        const handleSwipe = () => {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left - next image
                    this.navigate(1);
                } else {
                    // Swipe right - previous image
                    this.navigate(-1);
                }
            }
        };

        this.handleSwipe = handleSwipe;
    }
}

// Initialize lightbox when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Lightbox();
});

// Gallery Grid Animation
function animateGalleryGrid() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    const galleryObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'scale(0.9)';
                    entry.target.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';

                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'scale(1)';
                    }, 50);
                }, Array.from(galleryItems).indexOf(entry.target) * 100);

                galleryObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px'
    });

    galleryItems.forEach(item => {
        galleryObserver.observe(item);
    });
}

// Run gallery animation
document.addEventListener('DOMContentLoaded', animateGalleryGrid);

// Optional: Masonry layout adjustment
function adjustMasonryLayout() {
    const grid = document.querySelector('.gallery-grid');
    if (!grid) return;

    // This is a simple layout adjustment
    // For more complex masonry, consider using a library like Masonry.js
    const items = grid.querySelectorAll('.gallery-item');

    // Ensure equal heights in each row
    let rowItems = [];
    let currentTop = 0;

    items.forEach(item => {
        const rect = item.getBoundingClientRect();

        if (rect.top !== currentTop && rowItems.length > 0) {
            // New row
            rowItems = [item];
            currentTop = rect.top;
        } else {
            rowItems.push(item);
            currentTop = rect.top;
        }
    });
}

// Adjust layout on load and resize
window.addEventListener('load', adjustMasonryLayout);
window.addEventListener('resize', debounce(adjustMasonryLayout, 250));

// Utility: Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Image lazy loading optimization
document.addEventListener('DOMContentLoaded', () => {
    const galleryImages = document.querySelectorAll('.gallery-item img');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;

                // Add loaded class for transition
                img.addEventListener('load', () => {
                    img.style.opacity = '1';
                });

                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });

    galleryImages.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease-in';
        imageObserver.observe(img);
    });
});
