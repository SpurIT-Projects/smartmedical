// Main JavaScript functionality for Smart Medical website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeScrollToTop();
    initializeMobileMenu();
    initializeContactForm();
    initializeSmoothScrolling();
    initializeAnimations();
    
    console.log('Smart Medical website initialized successfully');
});

// Scroll to Top Button
function initializeScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (!scrollToTopBtn) return;
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Mobile Menu Toggle
function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navbar = document.querySelector('.navbar');
    
    if (!mobileMenuToggle) return;
    
    // Create mobile menu if it doesn't exist
    let mobileMenu = document.querySelector('.mobile-menu');
    if (!mobileMenu) {
        mobileMenu = createMobileMenu();
        document.body.appendChild(mobileMenu);
    }
    
    mobileMenuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        
        // Animate hamburger menu
        const spans = this.querySelectorAll('span');
        if (this.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            resetMobileMenuToggle(mobileMenuToggle);
        }
    });
}

function createMobileMenu() {
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    
    const navItems = document.querySelectorAll('.navbar-nav a');
    const menuList = document.createElement('ul');
    
    navItems.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.href;
        a.textContent = item.textContent;
        a.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            document.getElementById('mobileMenuToggle').classList.remove('active');
        });
        li.appendChild(a);
        menuList.appendChild(li);
    });
    
    const mobileActions = document.createElement('div');
    mobileActions.className = 'mobile-actions';
    
    const phoneBtn = document.createElement('button');
    phoneBtn.className = 'btn btn-outline btn-full';
    phoneBtn.innerHTML = '<i class="fas fa-phone"></i> +375-29-161-01-01';
    phoneBtn.onclick = function() { window.location.href = 'tel:+375291610101'; };
    
    const callbackBtn = document.createElement('button');
    callbackBtn.className = 'btn btn-outline btn-full';
    callbackBtn.innerHTML = '<i class="fas fa-phone-alt"></i> Заказать звонок';
    callbackBtn.onclick = requestCall;
    
    const bookingBtn = document.createElement('button');
    bookingBtn.className = 'btn btn-primary btn-full';
    bookingBtn.innerHTML = '<i class="fas fa-calendar-plus"></i> Запись онлайн';
    bookingBtn.onclick = bookOnline;
    
    mobileActions.appendChild(phoneBtn);
    mobileActions.appendChild(callbackBtn);
    mobileActions.appendChild(bookingBtn);
    
    mobileMenu.appendChild(menuList);
    mobileMenu.appendChild(mobileActions);
    
    return mobileMenu;
}

function resetMobileMenuToggle(toggle) {
    const spans = toggle.querySelectorAll('span');
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
}

// Contact Form
function initializeContactForm() {
    const form = document.getElementById('callbackForm');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            service: formData.get('service'),
            message: formData.get('message')
        };
        
        // Validate required fields
        if (!data.name || !data.phone) {
            showNotification('Пожалуйста, заполните обязательные поля', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<div class="loading"></div> Отправка...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            showNotification('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
        
        console.log('Форма отправлена:', data);
    });
}

// Smooth Scrolling for Navigation Links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animation on Scroll
function initializeAnimations() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        }
    );
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .gallery-item, .contact-item, .advantage-item');
    animatedElements.forEach(el => observer.observe(el));
}

// Button Actions
function bookOnline() {
    // This would typically integrate with a booking system
    showModal({
        title: 'Запись на прием',
        content: `
            <div class="booking-form">
                <p>Выберите удобный способ записи:</p>
                <div style="margin: 2rem 0;">
                    <button class="btn btn-primary btn-full" onclick="window.open('tel:+375291610101')" style="margin-bottom: 1rem;">
                        <i class="fas fa-phone"></i> Позвонить +375-29-161-01-01
                    </button>
                    <button class="btn btn-outline btn-full" onclick="scrollToContacts()">
                        <i class="fas fa-envelope"></i> Оставить заявку
                    </button>
                </div>
                <p><small>Время работы: Пн-Пт 8:00-20:00, Сб 9:00-18:00</small></p>
            </div>
        `
    });
}

function requestCall() {
    showModal({
        title: 'Заказать обратный звонок',
        content: `
            <form id="modalCallbackForm">
                <div class="form-group">
                    <label for="modalName">Имя *</label>
                    <input type="text" id="modalName" name="name" required>
                </div>
                <div class="form-group">
                    <label for="modalPhone">Телефон *</label>
                    <input type="tel" id="modalPhone" name="phone" required>
                </div>
                <div class="form-group">
                    <label for="modalTime">Удобное время для звонка</label>
                    <select id="modalTime" name="time">
                        <option value="">Любое время</option>
                        <option value="morning">Утром (9:00-12:00)</option>
                        <option value="afternoon">Днем (12:00-17:00)</option>
                        <option value="evening">Вечером (17:00-20:00)</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary btn-full">
                    <i class="fas fa-paper-plane"></i>
                    Заказать звонок
                </button>
            </form>
        `
    });
}

function showServiceDetails(serviceType) {
    const services = {
        'stomatology': {
            title: 'Стоматология',
            content: 'Современные методы лечения и профилактики заболеваний полости рта. Профессиональная гигиена, лечение кариеса, эндодонтическое лечение.'
        },
        'pediatric-dentistry': {
            title: 'Детская стоматология',
            content: 'Специализированная стоматологическая помощь для детей всех возрастов. Профилактика, лечение молочных зубов, исправление прикуса.'
        },
        'gynecology': {
            title: 'Гинекология',
            content: 'Комплексная диагностика и лечение гинекологических заболеваний. Профилактические осмотры, УЗИ диагностика, ведение беременности.'
        },
        'pediatric-gynecology': {
            title: 'Детская гинекология',
            content: 'Деликатная гинекологическая помощь для девочек и подростков. Профилактика, диагностика, консультации по вопросам полового развития.'
        },
        'pediatric-urology': {
            title: 'Детская урология',
            content: 'Диагностика и лечение урологических заболеваний у детей. Консультации, УЗИ диагностика, лечение врожденных аномалий.'
        },
        'endocrinology': {
            title: 'Эндокринология',
            content: 'Диагностика и лечение заболеваний эндокринной системы. Сахарный диабет, заболевания щитовидной железы, нарушения обмена веществ.'
        },
        'oncology': {
            title: 'Онкология',
            content: 'Ранняя диагностика и лечение онкологических заболеваний. Профилактические осмотры, консультации, современные методы диагностики.'
        },
        'ultrasound': {
            title: 'УЗИ диагностика',
            content: 'Современная ультразвуковая диагностика на новейшем оборудовании. УЗИ органов брюшной полости, малого таза, щитовидной железы.'
        }
    };
    
    const service = services[serviceType];
    if (service) {
        showModal({
            title: service.title,
            content: `
                <p>${service.content}</p>
                <div style="margin-top: 2rem;">
                    <button class="btn btn-primary btn-full" onclick="bookOnline()">
                        <i class="fas fa-calendar-plus"></i>
                        Записаться на прием
                    </button>
                </div>
            `
        });
    }
}

function scrollToServices() {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = servicesSection.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

function scrollToContacts() {
    const contactSection = document.getElementById('contacts');
    if (contactSection) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = contactSection.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Close modal if open
        closeModal();
    }
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

function showModal({ title, content }) {
    let modal = document.getElementById('globalModal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'globalModal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }
    
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" onclick="closeModal()">&times;</button>
            <h2>${title}</h2>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Handle form submission in modal
    const modalForm = modal.querySelector('#modalCallbackForm');
    if (modalForm) {
        modalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(modalForm);
            const data = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                time: formData.get('time')
            };
            
            if (!data.name || !data.phone) {
                showNotification('Пожалуйста, заполните обязательные поля', 'error');
                return;
            }
            
            const submitBtn = modalForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<div class="loading"></div> Отправка...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Заявка на обратный звонок отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
                closeModal();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
            
            console.log('Заявка на звонок:', data);
        });
    }
}

function closeModal() {
    const modal = document.getElementById('globalModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('globalModal');
    if (modal && e.target === modal) {
        closeModal();
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    
    if (window.innerWidth > 768) {
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
        }
        if (mobileMenuToggle) {
            mobileMenuToggle.classList.remove('active');
            resetMobileMenuToggle(mobileMenuToggle);
        }
    }
});

// Performance optimization: Lazy load images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize lazy loading when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeLazyLoading);