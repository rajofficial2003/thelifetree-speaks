/* =============================================
   THE LIFETREE — PREMIUM JAVASCRIPT
   ============================================= */

'use strict';

// === Utility ===
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

// ============================================
// 1. NAVBAR — glassmorphism on scroll
// ============================================
(function initNavbar() {
  const navbar = $('#navbar');
  let lastScroll = 0;
  let ticking = false;

  function updateNav() {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = scrollY;
    ticking = false;
  }

  on(window, 'scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });

  // Highlight active nav link
  const navLinks = $$('.nav-link');
  const sections = $$('section[id]');

  function highlightActiveLink() {
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(link => {
          link.style.color = '';
          link.style.fontWeight = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = 'var(--primary)';
            link.style.fontWeight = '600';
          }
        });
      }
    });
  }

  on(window, 'scroll', highlightActiveLink, { passive: true });
})();

// ============================================
// 2. MOBILE MENU
// ============================================
(function initMobileMenu() {
  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobile-menu');

  function toggleMenu(open) {
    if (open) {
      hamburger.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      mobileMenu.classList.add('open');
      mobileMenu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    } else {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  on(hamburger, 'click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    toggleMenu(!isOpen);
  });

  $$('.mobile-link, .mobile-cta').forEach(link => {
    on(link, 'click', () => toggleMenu(false));
  });

  on(document, 'keydown', (e) => {
    if (e.key === 'Escape') toggleMenu(false);
  });
})();

// ============================================
// 3. SCROLL ANIMATIONS — Intersection Observer
// ============================================
(function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -48px 0px'
  });

  $$('.animate-on-scroll').forEach(el => observer.observe(el));
})();

// ============================================
// 4. ANIMATED COUNTERS
// ============================================
(function initCounters() {
  const statItems = $$('.stat-item[data-target]');

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animateCounter(el, target, suffix, duration = 2000) {
    const statNum = el.querySelector('.stat-number');
    if (!statNum) return;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);
      const current = Math.round(eased * target);

      // Format thousands
      const formatted = current >= 1000 ? (current / 1000).toFixed(current >= 10000 ? 0 : 1) + 'k' : current;
      statNum.textContent = formatted + suffix;

      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, suffix);
        statsObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statItems.forEach(item => statsObserver.observe(item));
})();

// ============================================
// 5. FAQ ACCORDION
// ============================================
(function initFAQ() {
  const faqItems = $$('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    on(btn, 'click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all
      faqItems.forEach(other => {
        const otherBtn = other.querySelector('.faq-question');
        const otherAnswer = other.querySelector('.faq-answer');
        if (otherBtn && otherAnswer) {
          otherBtn.setAttribute('aria-expanded', 'false');
          otherAnswer.classList.remove('open');
        }
      });

      // Open clicked (if it was closed)
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });
  });
})();

// ============================================
// 6. APPOINTMENT FORM
// ============================================
(function initForm() {
  const form = $('#appointment-form');
  const successMsg = $('#form-success');
  const submitBtn = $('#form-submit-btn');

  if (!form) return;

  function showError(input, msg) {
    input.style.borderColor = '#e53e3e';
    let err = input.parentNode.querySelector('.field-error');
    if (!err) {
      err = document.createElement('span');
      err.className = 'field-error';
      err.style.cssText = 'color:#e53e3e;font-size:0.78rem;margin-top:4px;display:block';
      input.parentNode.appendChild(err);
    }
    err.textContent = msg;
  }

  function clearErrors() {
    $$('input, select, textarea', form).forEach(el => el.style.borderColor = '');
    $$('.field-error', form).forEach(el => el.remove());
  }

  function validate() {
    const name = $('#name');
    const phone = $('#phone');
    let valid = true;

    if (!name.value.trim()) {
      showError(name, 'Please enter your name.');
      valid = false;
    }
    if (!phone.value.trim() || !/[\d\s\+\-]{7,}/.test(phone.value)) {
      showError(phone, 'Please enter a valid phone number.');
      valid = false;
    }
    return valid;
  }

  on(form, 'submit', (e) => {
    e.preventDefault();
    clearErrors();

    if (!validate()) return;

    // Simulate submission
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    setTimeout(() => {
      form.style.display = 'none';
      if (successMsg) {
        successMsg.hidden = false;
        successMsg.style.display = 'flex';
      }
    }, 1200);
  });
})();

// ============================================
// 7. SMOOTH SCROLL for anchor links
// ============================================
(function initSmoothScroll() {
  on(document, 'click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 80;
    const top = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
})();

// ============================================
// 8. FLOATING BUTTONS — show after scroll
// ============================================
(function initFloatingButtons() {
  const fabContainer = $('.floating-actions');
  if (!fabContainer) return;

  fabContainer.style.opacity = '0';
  fabContainer.style.transform = 'translateX(80px)';
  fabContainer.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

  let shown = false;
  on(window, 'scroll', () => {
    if (window.scrollY > 400 && !shown) {
      fabContainer.style.opacity = '1';
      fabContainer.style.transform = 'translateX(0)';
      shown = true;
    }
  }, { passive: true });
})();

// ============================================
// 9. HERO IMAGE — lazy parallax effect
// ============================================
(function initParallax() {
  const heroImage = $('.hero-image');
  if (!heroImage || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;
  on(window, 'scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
          heroImage.style.transform = `translateY(${scrollY * 0.08}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

// ============================================
// 10. STAGGER animations for grid children
// ============================================
(function initStagger() {
  // Add extra stagger to doctors and testimonials
  const doctors = $$('.doctor-card');
  doctors.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
  });

  const stories = $$('.testimonial-card');
  stories.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.12}s`;
  });

  const faqs = $$('.faq-item');
  faqs.forEach((item, i) => {
    item.style.transitionDelay = `${i * 0.06}s`;
  });
})();

// ============================================
// 11. WhatsApp Button Pulse Animation
// ============================================
(function initWhatsappPulse() {
  const waBtns = $$('.fab-whatsapp');
  waBtns.forEach(btn => {
    const ring = document.createElement('span');
    ring.style.cssText = `
      position: absolute;
      inset: -4px;
      border-radius: inherit;
      border: 2px solid #25D366;
      animation: wa-ring 2s ease-out infinite;
      pointer-events: none;
    `;
    btn.style.position = 'relative';
    btn.appendChild(ring);
  });

  const style = document.createElement('style');
  style.textContent = `
    @keyframes wa-ring {
      0% { transform: scale(1); opacity: 0.8; }
      100% { transform: scale(1.4); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
})();

// ============================================
// 12. Page load progress bar
// ============================================
(function initPageProgress() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 3px; width: 0; z-index: 9999;
    background: linear-gradient(90deg, #355E3B, #6FAF5E, #F5D67A);
    transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.appendChild(bar);

  on(window, 'scroll', () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    bar.style.width = `${progress}%`;
  }, { passive: true });
})();

// ============================================
// 13. Service tags tooltip-like hover effect
// ============================================
(function initServiceCards() {
  $$('.service-card').forEach(card => {
    on(card, 'mouseenter', () => {
      card.style.background = 'var(--surface)';
    });
    on(card, 'mouseleave', () => {
      card.style.background = '';
    });
  });
})();

// ============================================
// 14. Testimonial card row equalize on large screens
// ============================================
(function initTestimonialEqualHeight() {
  function equalize() {
    const grid = $('.testimonials-grid');
    if (!grid || window.innerWidth < 768) return;
    const cards = $$('.testimonial-card', grid);
    cards.forEach(c => c.style.minHeight = '');
    let maxH = 0;
    cards.forEach(c => { maxH = Math.max(maxH, c.offsetHeight); });
    cards.forEach(c => c.style.minHeight = maxH + 'px');
  }
  on(window, 'load', equalize);
  on(window, 'resize', debounce(equalize, 200));
})();

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ============================================
// 15. Journey steps hover connector highlight
// ============================================
(function initJourneyHover() {
  $$('.journey-step').forEach((step, idx) => {
    on(step, 'mouseenter', () => {
      const connectors = $$('.journey-connector');
      if (connectors[idx]) {
        connectors[idx].style.background = 'linear-gradient(90deg, #355E3B, #355E3B)';
        connectors[idx].style.height = '3px';
      }
    });
    on(step, 'mouseleave', () => {
      $$('.journey-connector').forEach(c => {
        c.style.background = '';
        c.style.height = '';
      });
    });
  });
})();

// ============================================
// 16. Performance: lazy-load non-hero images
// ============================================
(function initLazyImages() {
  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imgObserver.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    $$('img[data-src]').forEach(img => imgObserver.observe(img));
  }
})();

console.log('🌿 The LifeTree — Premium Website Loaded');
