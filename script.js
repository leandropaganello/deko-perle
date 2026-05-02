/* ===========================================
   DEKO PERLE — minimal interactions
   =========================================== */

(function () {
  'use strict';

  /* ---- 1. Sticky navbar shadow on scroll ---- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 20) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- 2. Mobile menu toggle ---- */
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  });
  // Close menu when clicking a link
  links.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    })
  );

  /* ---- 3. Reveal-on-scroll using IntersectionObserver ---- */
  const reveals = document.querySelectorAll('.reveal');
  // Make above-the-fold elements visible immediately
  const revealNow = (el) => el.classList.add('visible');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealNow(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) revealNow(el);
      else io.observe(el);
    });
  } else {
    reveals.forEach(revealNow);
  }

  /* ---- 4. Contact form (Formspree integration) ---- */
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Senden...';

    const formData = new FormData(form);
    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        submitBtn.textContent = '✓ Gesendet';
        success.hidden = false;
        form.reset();
        setTimeout(() => {
          submitBtn.textContent = originalText;
          success.hidden = true;
          submitBtn.disabled = false;
        }, 5000);
      } else {
        throw new Error('Fehler beim Senden');
      }
    })
    .catch(error => {
      console.error('Form submission error:', error);
      submitBtn.textContent = 'Fehler - Versuche erneut';
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 3000);
    });
  });

  /* ---- 5. Footer year ---- */
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
