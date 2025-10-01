// Reusable JavaScript components for Smart Medical website

// Accordion Component
class Accordion {
    constructor(element) {
        this.accordion = element;
        this.init();
    }
    
    init() {
        const headers = this.accordion.querySelectorAll('.accordion-header');
        
        headers.forEach(header => {
            header.addEventListener('click', () => {
                const item = header.parentElement;
                const isActive = item.classList.contains('active');
                
                // Close all items
                this.closeAll();
                
                // Open clicked item if it wasn't active
                if (!isActive) {
                    this.open(item);
                }
            });
        });
    }
    
    open(item) {
        item.classList.add('active');
        const content = item.querySelector('.accordion-content');
        const body = item.querySelector('.accordion-body');
        
        if (content && body) {
            content.style.maxHeight = body.scrollHeight + 'px';
        }
    }
    
    close(item) {
        item.classList.remove('active');
        const content = item.querySelector('.accordion-content');
        
        if (content) {
            content.style.maxHeight = '0';
        }
    }
    
    closeAll() {
        const items = this.accordion.querySelectorAll('.accordion-item');
        items.forEach(item => this.close(item));
    }
}

// Tab Component
class Tabs {
    constructor(element) {
        this.tabContainer = element;
        this.init();
    }
    
    init() {
        const buttons = this.tabContainer.querySelectorAll('.tab-button');
        
        buttons.forEach((button, index) => {
            button.addEventListener('click', () => {
                this.switchTab(index);
            });
        });
        
        // Show first tab by default
        if (buttons.length > 0) {
            this.switchTab(0);
        }
    }
    
    switchTab(index) {
        const buttons = this.tabContainer.querySelectorAll('.tab-button');
        const contents = this.tabContainer.querySelectorAll('.tab-content');
        
        // Remove active class from all buttons and contents
        buttons.forEach(btn => btn.classList.remove('active'));
        contents.forEach(content => content.classList.remove('active'));
        
        // Add active class to selected button and content
        if (buttons[index]) {
            buttons[index].classList.add('active');
        }
        
        if (contents[index]) {
            contents[index].classList.add('active');
        }
    }
}

// Progress Bar Component
class ProgressBar {
    constructor(element) {
        this.progressElement = element;
        this.bar = element.querySelector('.progress-bar');
        this.init();
    }
    
    init() {
        // Animate progress bar when it comes into view
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animate();
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );
        
        observer.observe(this.progressElement);
    }
    
    animate() {
        const targetWidth = this.bar.dataset.width || '100%';
        setTimeout(() => {
            this.bar.style.width = targetWidth;
        }, 300);
    }
    
    setProgress(percentage) {
        this.bar.style.width = percentage + '%';
    }
}

// Image Gallery Component
class Gallery {
    constructor(element) {
        this.gallery = element;
        this.init();
    }
    
    init() {
        const items = this.gallery.querySelectorAll('.gallery-item');
        
        items.forEach((item, index) => {
            item.addEventListener('click', () => {
                this.openLightbox(index);
            });
        });
    }
    
    openLightbox(startIndex) {
        const items = this.gallery.querySelectorAll('.gallery-item img');
        const images = Array.from(items).map(img => ({
            src: img.src,
            alt: img.alt
        }));
        
        const lightbox = this.createLightbox(images, startIndex);
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
    }
    
    createLightbox(images, startIndex) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <button class="lightbox-prev">&#8249;</button>
                <img class="lightbox-image" src="${images[startIndex].src}" alt="${images[startIndex].alt}">
                <button class="lightbox-next">&#8250;</button>
                <div class="lightbox-counter">${startIndex + 1} / ${images.length}</div>
            </div>
        `;
        
        let currentIndex = startIndex;
        
        // Close button
        lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
            this.closeLightbox(lightbox);
        });
        
        // Previous button
        lightbox.querySelector('.lightbox-prev').addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            this.updateLightboxImage(lightbox, images, currentIndex);
        });
        
        // Next button
        lightbox.querySelector('.lightbox-next').addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            this.updateLightboxImage(lightbox, images, currentIndex);
        });
        
        // Keyboard navigation
        const handleKeydown = (e) => {
            switch(e.key) {
                case 'Escape':
                    this.closeLightbox(lightbox);
                    break;
                case 'ArrowLeft':
                    lightbox.querySelector('.lightbox-prev').click();
                    break;
                case 'ArrowRight':
                    lightbox.querySelector('.lightbox-next').click();
                    break;
            }
        };
        
        document.addEventListener('keydown', handleKeydown);
        
        // Store cleanup function
        lightbox.cleanup = () => {
            document.removeEventListener('keydown', handleKeydown);
        };
        
        // Close on background click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                this.closeLightbox(lightbox);
            }
        });
        
        return lightbox;
    }
    
    updateLightboxImage(lightbox, images, index) {
        const img = lightbox.querySelector('.lightbox-image');
        const counter = lightbox.querySelector('.lightbox-counter');
        
        img.src = images[index].src;
        img.alt = images[index].alt;
        counter.textContent = `${index + 1} / ${images.length}`;
    }
    
    closeLightbox(lightbox) {
        if (lightbox.cleanup) {
            lightbox.cleanup();
        }
        document.body.style.overflow = '';
        lightbox.remove();
    }
}

// Form Validator Component
class FormValidator {
    constructor(form) {
        this.form = form;
        this.rules = {};
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                this.onSuccess();
            }
        });
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearError(input);
            });
        });
    }
    
    addRule(fieldName, validator, message) {
        this.rules[fieldName] = { validator, message };
    }
    
    validateForm() {
        let isValid = true;
        const formData = new FormData(this.form);
        
        for (const [fieldName, rule] of Object.entries(this.rules)) {
            const value = formData.get(fieldName);
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            
            if (!rule.validator(value)) {
                this.showError(field, rule.message);
                isValid = false;
            } else {
                this.clearError(field);
            }
        }
        
        return isValid;
    }
    
    validateField(field) {
        const fieldName = field.name;
        const rule = this.rules[fieldName];
        
        if (rule) {
            const value = field.value;
            if (!rule.validator(value)) {
                this.showError(field, rule.message);
                return false;
            } else {
                this.clearError(field);
                return true;
            }
        }
        
        return true;
    }
    
    showError(field, message) {
        this.clearError(field);
        
        field.classList.add('error');
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
    }
    
    clearError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    onSuccess() {
        // Override this method
        console.log('Form is valid');
    }
}

// Carousel Component
class Carousel {
    constructor(element) {
        this.carousel = element;
        this.slides = element.querySelectorAll('.carousel-slide');
        this.currentSlide = 0;
        this.autoPlayInterval = null;
        this.init();
    }
    
    init() {
        if (this.slides.length === 0) return;
        
        this.createControls();
        this.showSlide(0);
        
        // Auto-play if enabled
        if (this.carousel.dataset.autoplay === 'true') {
            this.startAutoPlay();
        }
        
        // Pause on hover
        this.carousel.addEventListener('mouseenter', () => {
            this.stopAutoPlay();
        });
        
        this.carousel.addEventListener('mouseleave', () => {
            if (this.carousel.dataset.autoplay === 'true') {
                this.startAutoPlay();
            }
        });
        
        // Touch/swipe support
        this.addTouchSupport();
    }
    
    createControls() {
        // Previous/Next buttons
        const prevBtn = document.createElement('button');
        prevBtn.className = 'carousel-prev';
        prevBtn.innerHTML = '&#8249;';
        prevBtn.addEventListener('click', () => this.prevSlide());
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'carousel-next';
        nextBtn.innerHTML = '&#8250;';
        nextBtn.addEventListener('click', () => this.nextSlide());
        
        this.carousel.appendChild(prevBtn);
        this.carousel.appendChild(nextBtn);
        
        // Dots indicator
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'carousel-dots';
        
        this.slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.addEventListener('click', () => this.showSlide(index));
            dotsContainer.appendChild(dot);
        });
        
        this.carousel.appendChild(dotsContainer);
    }
    
    showSlide(index) {
        // Hide all slides
        this.slides.forEach(slide => slide.classList.remove('active'));
        
        // Show current slide
        this.slides[index].classList.add('active');
        
        // Update dots
        const dots = this.carousel.querySelectorAll('.carousel-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        this.currentSlide = index;
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prevIndex);
    }
    
    startAutoPlay() {
        const interval = parseInt(this.carousel.dataset.interval) || 5000;
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, interval);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    addTouchSupport() {
        let startX = 0;
        let startY = 0;
        
        this.carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        this.carousel.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Only handle horizontal swipes
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        });
    }
}

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize accordions
    document.querySelectorAll('.accordion').forEach(accordion => {
        new Accordion(accordion);
    });
    
    // Initialize tabs
    document.querySelectorAll('.tabs').forEach(tabs => {
        new Tabs(tabs);
    });
    
    // Initialize progress bars
    document.querySelectorAll('.progress').forEach(progress => {
        new ProgressBar(progress);
    });
    
    // Initialize galleries
    document.querySelectorAll('.gallery').forEach(gallery => {
        new Gallery(gallery);
    });
    
    // Initialize carousels
    document.querySelectorAll('.carousel').forEach(carousel => {
        new Carousel(carousel);
    });
});

// Utility function to initialize components dynamically
window.SmartMedicalComponents = {
    Accordion,
    Tabs,
    ProgressBar,
    Gallery,
    FormValidator,
    Carousel
};