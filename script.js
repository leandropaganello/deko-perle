/* ===========================================
   DEKO PERLE — minimal interactions
   =========================================== */

(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');

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

  const setMenu = (open) => {
    links.classList.toggle('open', open);
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  };

  toggle.addEventListener('click', () => {
    setMenu(!links.classList.contains('open'));
  });

  links.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => setMenu(false))
  );

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && links.classList.contains('open')) {
      setMenu(false);
      toggle.focus();
    }
  });

  document.addEventListener('click', (e) => {
    if (!links.classList.contains('open')) return;
    if (!links.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
  });

  /* ---- 3. Reveal-on-scroll using IntersectionObserver ---- */
  const reveals = document.querySelectorAll('.reveal');
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
  if (form) {
    const success = document.getElementById('formSuccess');
    const error = document.getElementById('formError');
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.textContent;

    const showError = () => {
      success.hidden = true;
      error.hidden = false;
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      error.hidden = true;

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Honeypot: von Bots ausgefüllt, von Menschen unsichtbar
      const gotcha = form.querySelector('[name="_gotcha"]');
      if (gotcha && gotcha.value) {
        form.reset();
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Senden...';

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then((response) => {
          if (!response.ok) throw new Error('Fehler beim Senden');
          submitBtn.textContent = '✓ Gesendet';
          success.hidden = false;
          form.reset();
          setTimeout(() => {
            submitBtn.textContent = originalText;
            success.hidden = true;
            submitBtn.disabled = false;
          }, 6000);
        })
        .catch((err) => {
          console.error('Form submission error:', err);
          showError();
        });
    });

    form.addEventListener('input', () => { error.hidden = true; });
  }

  /* ---- 5. Footer year ---- */
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
