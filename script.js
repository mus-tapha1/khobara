// Premium Animations and Interactions for Khobara Web

// Smooth Scroll Behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Intersection Observer for Fade-in Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements with animation classes
document.querySelectorAll('.animate-fade-in-up, .animate-fade-in-down, .animate-slide-in-left, .animate-slide-in-right, .animate-scale-in').forEach(el => {
    el.classList.add('opacity-0', 'translate-y-10');
    observer.observe(el);
});

// Language Switcher
function setLanguage(lang) {
    const html = document.documentElement;
    if (lang === 'en') {
        html.lang = 'en';
        html.dir = 'ltr';
        localStorage.setItem('language', 'en');
    } else {
        html.lang = 'ar';
        html.dir = 'rtl';
        localStorage.setItem('language', 'ar');
    }
}

// Load saved language preference
window.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('language') || 'ar';
    setLanguage(savedLang);
});

// FAQ Toggle - FIXED: Add icon rotation
function toggleFaq(button) {
    const answer = button.nextElementSibling;
    const icon = button.querySelector('.faq-icon, span');
    
    if (answer.classList.contains('hidden')) {
        answer.classList.remove('hidden');
        if (icon) {
            icon.textContent = '−';
            icon.classList.add('rotate');
            icon.style.transform = 'rotate(45deg)';
        }
        button.classList.add('active');
    } else {
        answer.classList.add('hidden');
        if (icon) {
            icon.textContent = '+';
            icon.classList.remove('rotate');
            icon.style.transform = 'rotate(0deg)';
        }
        button.classList.remove('active');
    }
}

// Parallax Effect on Scroll
window.addEventListener('scroll', () => {
    const parallaxElements = document.querySelectorAll('.parallax');
    parallaxElements.forEach(el => {
        const scrollPosition = window.pageYOffset;
        el.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
    });
});

// Sticky Header Effect
const header = document.querySelector('header');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (header) {
        if (scrollTop > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
        } else {
            header.style.boxShadow = 'none';
        }
    }
    
    lastScrollTop = scrollTop;
});

// Counter Animation for Statistics - FIXED
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const step = target / Math.ceil(duration / 16);
    let startTime = null;
    
    function update(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        current = Math.floor(progress * target);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
    
    requestAnimationFrame(update);
}

// Trigger counter animation when section is visible - FIXED for all pages
document.addEventListener('DOMContentLoaded', function() {
    const statsSections = document.querySelectorAll('.stats-section');
    statsSections.forEach(statsSection => {
        const counters = statsSection.querySelectorAll('[data-count]');
        if (counters.length === 0) return;
        
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    counters.forEach(counter => {
                        const target = parseInt(counter.getAttribute('data-count'));
                        if (target > 0) {
                            animateCounter(counter, target);
                        }
                    });
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        statsObserver.observe(statsSection);
    });
});

// Form Validation and Submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        // If form has action set (like Formspree), let it submit naturally
        if (contactForm.action && contactForm.action !== '') {
            return;
        }
        
        e.preventDefault();
        
        const name = contactForm.querySelector('input[name="name"]');
        const email = contactForm.querySelector('input[name="email"]');
        const subject = contactForm.querySelector('input[name="subject"]');
        const message = contactForm.querySelector('textarea[name="message"]');
        
        // Simple validation
        if (!name || !email || !subject || !message) {
            alert('يرجى ملء جميع الحقول');
            return;
        }
        
        if (!name.value || !email.value || !subject.value || !message.value) {
            alert('يرجى ملء جميع الحقول');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            alert('يرجى إدخال بريد إلكتروني صحيح');
            return;
        }
        
        alert('شكراً لتواصلك معنا! سنرد عليك قريباً.');
        contactForm.reset();
    });
}

// FIX: Removed hover transform conflict with Tailwind
// Instead, only add hover effects if not already handled by CSS/Tailwind
document.querySelectorAll('.testimonial-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Portfolio Filter (if needed)
const portfolioFilters = document.querySelectorAll('[data-filter]');
const portfolioItems = document.querySelectorAll('.portfolio-item');

if (portfolioFilters.length > 0) {
    portfolioFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            const filterValue = filter.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    item.classList.add('animate-scale-in');
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const closeMobileMenuBtn = document.getElementById('closeMobileMenu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
}

if (closeMobileMenuBtn && mobileMenu) {
    closeMobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        document.body.style.overflow = ''; // Restore scrolling
    });
}

// Close mobile menu when clicking a link
if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            document.body.style.overflow = '';
        });
    });
}

// Close mobile menu on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        document.body.style.overflow = '';
    }
});

// Back to Top Button
document.addEventListener('DOMContentLoaded', function() {
    const backToTop = document.createElement('button');
    backToTop.id = 'backToTop';
    backToTop.innerHTML = '↑';
    backToTop.setAttribute('aria-label', 'العودة لأعلى الصفحة');
    backToTop.style.cssText = 'position:fixed;bottom:30px;left:30px;width:50px;height:50px;border-radius:50%;background:#1a73e8;color:white;border:none;cursor:pointer;font-size:1.5rem;display:none;align-items:center;justify-content:center;z-index:1000;transition:all 0.3s ease;box-shadow:0 4px 15px rgba(33,150,243,0.4);';
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTop.style.display = 'flex';
        } else {
            backToTop.style.display = 'none';
        }
    });

    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    backToTop.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 6px 20px rgba(33,150,243,0.6)';
    });

    backToTop.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 15px rgba(33,150,243,0.4)';
    });
});

// Lazy Loading Images
if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Add animation delay classes dynamically
document.querySelectorAll('[data-animation-delay]').forEach((el, index) => {
    const delay = el.getAttribute('data-animation-delay');
    el.style.animationDelay = delay;
});

// Keyboard Navigation for Accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const openMenus = document.querySelectorAll('[data-menu].open');
        openMenus.forEach(menu => menu.classList.remove('open'));
    }
});

// Performance: Debounce scroll events
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

// Apply debounce to scroll events
const debouncedScroll = debounce(() => {
    // Scroll event handling
}, 100);

window.addEventListener('scroll', debouncedScroll);

// Dynamic Content Loading (for future AJAX functionality)
async function loadContent(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.text();
        return data;
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

// Initialize animations on page load
window.addEventListener('load', () => {
    document.querySelectorAll('[data-animate]').forEach(el => {
        el.classList.add('animate-fade-in-up');
    });
});

// Prevent FOUC (Flash of Unstyled Content)
document.documentElement.style.visibility = 'visible';

console.log('Khobara Web - Premium Digital Agency Website Loaded Successfully');
