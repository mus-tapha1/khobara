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

// FAQ Toggle
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

// Counter Animation for Statistics
function animateCounter(element, target, duration = 2000) {
    let startTime = null;
    
    function update(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(progress * target);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
    
    requestAnimationFrame(update);
}

// Trigger counter animation when section is visible
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

// Form Validation and AJAX Submission (stays on page, no redirect)
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.textContent : '';

        // Show loading state
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'جارٍ الإرسال...';
        }

        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                // Show success message inside the form area
                contactForm.innerHTML = `
                    <div style="text-align:center; padding: 2rem;">
                        <div style="font-size:3rem; margin-bottom:1rem;">✅</div>
                        <h3 style="color:#4ade80; font-size:1.5rem; font-weight:bold; margin-bottom:0.5rem;">تم إرسال رسالتك بنجاح!</h3>
                        <p style="color:#9ca3af;">شكراً لتواصلك معنا. سنرد عليك خلال 24 ساعة.</p>
                    </div>`;
            } else {
                const data = await response.json();
                const errorMsg = (data && data.errors)
                    ? data.errors.map(e => e.message).join(', ')
                    : 'حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى أو التواصل عبر البريد الإلكتروني.';
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
                showFormError(contactForm, errorMsg);
            }
        } catch (err) {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
            showFormError(contactForm, 'تعذّر الاتصال. يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً.');
        }
    });
}

function showFormError(form, message) {
    let errEl = form.querySelector('.form-error');
    if (!errEl) {
        errEl = document.createElement('p');
        errEl.className = 'form-error';
        errEl.style.cssText = 'color:#f87171;margin-top:0.75rem;font-size:0.9rem;text-align:center;';
        form.appendChild(errEl);
    }
    errEl.textContent = message;
}

// Testimonial card hover
document.querySelectorAll('.testimonial-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Portfolio Filter
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

// Mobile Menu Toggle — FIX: toggle open/close + change icon
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const closeMobileMenuBtn = document.getElementById('closeMobileMenu');

function openMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    if (mobileMenuBtn) mobileMenuBtn.innerHTML = '✕';
}

function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('hidden');
    document.body.style.overflow = '';
    if (mobileMenuBtn) mobileMenuBtn.innerHTML = '☰';
}

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        if (mobileMenu.classList.contains('hidden')) {
            openMobileMenu();
        } else {
            closeMobileMenu();
        }
    });
}

if (closeMobileMenuBtn && mobileMenu) {
    closeMobileMenuBtn.addEventListener('click', closeMobileMenu);
}

// Close mobile menu when clicking a nav link
if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
}

// Close mobile menu on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && !mobileMenu.classList.contains('hidden')) {
        closeMobileMenu();
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

const debouncedScroll = debounce(() => {}, 100);
window.addEventListener('scroll', debouncedScroll);

// Dynamic Content Loading (for future use)
async function loadContent(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.text();
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

// Prevent FOUC
document.documentElement.style.visibility = 'visible';

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const openMenus = document.querySelectorAll('[data-menu].open');
        openMenus.forEach(menu => menu.classList.remove('open'));
    }
});

console.log('Khobara Web - Premium Digital Agency Website Loaded Successfully');
