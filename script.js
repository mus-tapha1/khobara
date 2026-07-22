// ===== MOBILE MENU TOGGLE =====
    (function () {
      var btn   = document.getElementById('mobileMenuBtn');
      var menu  = document.getElementById('mobileMenu');
      var close = document.getElementById('closeMobileMenu');
      if (!btn || !menu) return;

      var isOpen = false;

      function openMenu() {
          isOpen = true;
          menu.style.cssText += ';display:block !important;z-index:9999;';
          document.body.style.overflow = 'hidden';
          btn.innerHTML = '&#10005;';
          btn.setAttribute('aria-expanded', 'true');
      }

      function closeMenu() {
          isOpen = false;
          menu.style.display = 'none';
          document.body.style.overflow = '';
          btn.innerHTML = '&#9776;';
          btn.setAttribute('aria-expanded', 'false');
      }

      // Start hidden
      menu.style.display = 'none';

      btn.addEventListener('click', function (e) {
          e.stopPropagation();
          isOpen ? closeMenu() : openMenu();
      });

      if (close) close.addEventListener('click', closeMenu);

      menu.querySelectorAll('a').forEach(function (link) {
          link.addEventListener('click', closeMenu);
      });

      document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape' && isOpen) closeMenu();
      });
    })();

    // Smooth Scroll Behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return; // skip dead links
        e.preventDefault();
        const target = document.querySelector(href);
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
            icon.style.transform = 'rotate(45deg)';
        }
        button.classList.add('active');
    } else {
        answer.classList.add('hidden');
        if (icon) {
            icon.textContent = '+';
            icon.style.transform = 'rotate(0deg)';
        }
        button.classList.remove('active');
    }
}

// Sticky Header Effect
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (header) {
        header.style.boxShadow = scrollTop > 100 ? '0 4px 20px rgba(0,0,0,0.5)' : 'none';
    }
});

// Counter Animation for Statistics
function animateCounter(element, target, duration = 2000) {
    let startTime = null;
    function update(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        element.textContent = Math.floor(progress * target);
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
                        if (target > 0) animateCounter(counter, target);
                    });
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        statsObserver.observe(statsSection);
    });
});

// Form Validation and AJAX Submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.textContent : '';
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
                    : 'حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.';
                if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalText; }
                showFormError(contactForm, errorMsg);
            }
        } catch (err) {
            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalText; }
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

// Portfolio Filter
const portfolioFilters = document.querySelectorAll('[data-filter]');
const portfolioItems = document.querySelectorAll('.portfolio-item, .template-card');
if (portfolioFilters.length > 0) {
    portfolioFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            const filterValue = filter.getAttribute('data-filter');
            // Update active state
            portfolioFilters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    item.classList.remove('hidden');
                    item.classList.add('animate-scale-in');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
}

// Mobile Menu Toggle
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
        mobileMenu.classList.contains('hidden') ? openMobileMenu() : closeMobileMenu();
    });
}
if (closeMobileMenuBtn) closeMobileMenuBtn.addEventListener('click', closeMobileMenu);
if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobileMenu));
}
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && !mobileMenu.classList.contains('hidden')) closeMobileMenu();
});

// Back to Top Button
document.addEventListener('DOMContentLoaded', function() {
    const backToTop = document.createElement('button');
    backToTop.id = 'backToTop';
    backToTop.innerHTML = '↑';
    backToTop.setAttribute('aria-label', 'العودة لأعلى الصفحة');
    backToTop.style.cssText = 'position:fixed;bottom:30px;right:30px;width:50px;height:50px;border-radius:50%;background:#1a73e8;color:white;border:none;cursor:pointer;font-size:1.5rem;display:none;align-items:center;justify-content:center;z-index:1000;transition:all 0.3s ease;box-shadow:0 4px 15px rgba(33,150,243,0.4);';
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        backToTop.style.display = window.scrollY > 300 ? 'flex' : 'none';
    });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    backToTop.addEventListener('mouseenter', () => {
        backToTop.style.transform = 'translateY(-3px)';
        backToTop.style.boxShadow = '0 6px 20px rgba(33,150,243,0.6)';
    });
    backToTop.addEventListener('mouseleave', () => {
        backToTop.style.transform = 'translateY(0)';
        backToTop.style.boxShadow = '0 4px 15px rgba(33,150,243,0.4)';
    });

    // WhatsApp Floating Button
    const waBtn = document.createElement('a');
    waBtn.href = 'https://wa.me/212778878421';
    waBtn.target = '_blank';
    waBtn.rel = 'noopener noreferrer';
    waBtn.setAttribute('aria-label', 'تواصل عبر واتساب');
    waBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
    waBtn.style.cssText = 'position:fixed;bottom:90px;right:30px;width:55px;height:55px;border-radius:50%;background:#25D366;color:white;display:flex;align-items:center;justify-content:center;z-index:1000;text-decoration:none;box-shadow:0 4px 15px rgba(37,211,102,0.5);transition:all 0.3s ease;';
    document.body.appendChild(waBtn);
    waBtn.addEventListener('mouseenter', () => {
        waBtn.style.transform = 'scale(1.1)';
        waBtn.style.boxShadow = '0 6px 25px rgba(37,211,102,0.7)';
    });
    waBtn.addEventListener('mouseleave', () => {
        waBtn.style.transform = 'scale(1)';
        waBtn.style.boxShadow = '0 4px 15px rgba(37,211,102,0.5)';
    });
});

// Initialize animations on page load
window.addEventListener('load', () => {
    document.querySelectorAll('[data-animate]').forEach(el => {
        el.classList.add('animate-fade-in-up');
    });
    document.documentElement.style.visibility = 'visible';
});

console.log('Khobara Web - Premium Digital Agency Website Loaded Successfully');
