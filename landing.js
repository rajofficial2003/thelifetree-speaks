/* =============================================
   LIFETREE LANDING PAGE — JS
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ---- HEADER SCROLL ----
  const header = document.getElementById('lp-header');
  let lastScrollY = 0;

  function onScroll() {
    const sy = window.scrollY;
    if (sy > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScrollY = sy;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- FABs VISIBILITY ----
  const fabs = document.getElementById('lp-fabs');
  function toggleFabs() {
    if (window.scrollY > 400) {
      fabs.classList.add('visible');
    } else {
      fabs.classList.remove('visible');
    }
  }
  window.addEventListener('scroll', toggleFabs, { passive: true });
  toggleFabs();

  // ---- SCROLL REVEAL ----
  const reveals = document.querySelectorAll('.anim-reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });
  reveals.forEach(el => revealObserver.observe(el));

  // ---- SMOOTH ANCHOR SCROLLING ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerH = header.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 10;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- FORM HANDLING ----
  const form = document.getElementById('lp-form');
  const successEl = document.getElementById('lp-form-success');

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      // Clear previous errors
      form.querySelectorAll('.lp-form-group').forEach(g => g.classList.remove('invalid'));

      // Validate
      let valid = true;
      const name = document.getElementById('lp-name');
      const phone = document.getElementById('lp-phone');

      if (!name.value.trim()) {
        name.closest('.lp-form-group').classList.add('invalid');
        valid = false;
      }
      if (!phone.value.trim() || phone.value.replace(/\D/g, '').length < 10) {
        phone.closest('.lp-form-group').classList.add('invalid');
        valid = false;
      }

      if (!valid) {
        // Shake the form
        form.style.animation = 'lp-shake 0.4s ease-in-out';
        setTimeout(() => form.style.animation = '', 400);
        return;
      }

      // Collect form data (for future use)
      const formData = {
        name: name.value.trim(),
        phone: phone.value.trim(),
        email: document.getElementById('lp-email').value.trim(),
        age: document.getElementById('lp-age').value,
        trying_duration: document.getElementById('lp-trying').value,
        message: document.getElementById('lp-message').value.trim(),
        timestamp: new Date().toISOString(),
        source: 'landing_page_ads'
      };

      // Log for debugging (connect to backend later)
      console.log('Lead captured:', formData);

      // Show success
      form.querySelectorAll('.lp-form-row, .lp-form-group, .lp-form-privacy, .lp-btn, .lp-form-title').forEach(el => {
        el.style.display = 'none';
      });
      successEl.hidden = false;
      successEl.style.animation = 'lp-fadeUp 0.5s ease-out';

      // Scroll to success
      successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // ---- COUNTER ANIMATION FOR FLOATING CARD ----
  // (Already in hero section, purely visual)

  // ---- SHAKE KEYFRAMES ----
  if (!document.getElementById('lp-shake-style')) {
    const style = document.createElement('style');
    style.id = 'lp-shake-style';
    style.textContent = `
      @keyframes lp-shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-6px); }
        40% { transform: translateX(6px); }
        60% { transform: translateX(-4px); }
        80% { transform: translateX(4px); }
      }
    `;
    document.head.appendChild(style);
  }

});
