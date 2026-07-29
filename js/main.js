/* ============================================================
   ZEPFTER — MAIN JAVASCRIPT
============================================================ */

(function () {
  'use strict';

  const SERVICE_TABS = ['lims', 'sap', 'analytics', 'csv', 'scm', 'rpa', 'ai', 'cloud'];
  const MOBILE_BREAKPOINT = 768;

  function isMobile() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  function closeMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger) hamburger.classList.remove('open');
    if (navLinks) navLinks.classList.remove('open');
    document.body.classList.remove('nav-open');
    document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
  }

  function openMobileNav() {
    document.body.classList.add('nav-open');
  }

  /* ============================================================
     1. NAVBAR
  ============================================================ */
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const allNavLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    if (!navbar || !hamburger || !navLinks) return;

    function onScroll() {
      navbar.classList.toggle('scrolled', window.scrollY > 60);

      let current = '';
      sections.forEach(section => {
        const top = section.offsetTop - 100;
        if (window.scrollY >= top) current = section.getAttribute('id');
      });
      allNavLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href') || '';
        if (current && href.includes('#' + current)) link.classList.add('active');
        else if (current && href.endsWith(current + '.html')) link.classList.add('active');
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      navLinks.classList.toggle('open', isOpen);
      document.body.classList.toggle('nav-open', isOpen);
      if (!isOpen) {
        document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
      }
    });

    navLinks.addEventListener('click', e => {
      const link = e.target.closest('a');
      if (!link) return;

      if (link.classList.contains('nav-link') && link.closest('.dropdown') && isMobile()) {
        e.preventDefault();
        const dropdown = link.closest('.dropdown');
        const wasOpen = dropdown.classList.contains('open');
        document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
        if (!wasOpen) dropdown.classList.add('open');
        return;
      }

      if (link.classList.contains('nav-link') || link.closest('.dropdown-menu')) {
        if (!link.closest('.dropdown') || !isMobile()) {
          closeMobileNav();
        }
      }
    });

    window.addEventListener('resize', () => {
      if (!isMobile()) closeMobileNav();
    });
  }

  /* ============================================================
     2. AOS
  ============================================================ */
  function initAOS() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('[data-aos]').forEach(el => el.classList.add('aos-animate'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.aosDelay || '0', 10);
          setTimeout(() => el.classList.add('aos-animate'), delay);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

    document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
  }

  /* ============================================================
     3. COUNTERS
  ============================================================ */
  function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    const statsBar = document.getElementById('stats');
    if (!statsBar || counters.length === 0) return;

    let triggered = false;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !triggered) {
        triggered = true;
        counters.forEach(el => animateCounter(el));
      }
    }, { threshold: 0.4 });
    observer.observe(statsBar);

    function animateCounter(el) {
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 2000;
      const steps = 60;
      const increment = target / steps;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        const current = Math.min(Math.round(increment * step), target);
        el.textContent = current + (current >= target ? suffix : '');
        if (step >= steps) clearInterval(timer);
      }, duration / steps);
    }
  }

  /* ============================================================
     4. SERVICES TABS + HASH ROUTING
  ============================================================ */
  function activateTab(tabId) {
    if (!SERVICE_TABS.includes(tabId)) return;

    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === `tab-${tabId}`);
    });
  }

  function scrollToTabs() {
    const tabs = document.querySelector('.services-tabs');
    if (!tabs) return;
    const navH = document.getElementById('navbar')?.offsetHeight || 72;
    const top = tabs.getBoundingClientRect().top + window.scrollY - navH - 16;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }

  function handleServiceHash(scroll) {
    const hash = location.hash.replace('#', '');
    if (!SERVICE_TABS.includes(hash)) return;
    if (!document.querySelector('.tab-btn')) return;

    activateTab(hash);
    if (scroll) {
      requestAnimationFrame(() => scrollToTabs());
    }
  }

  function initTabSystem() {
    if (!document.querySelector('.tab-btn')) return;

    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        activateTab(tab);
        history.replaceState(null, '', `#${tab}`);
      });
    });

    document.querySelectorAll('a[href*="#"]').forEach(link => {
      const href = link.getAttribute('href') || '';
      const match = href.match(/#([a-z]+)$/);
      if (!match || !SERVICE_TABS.includes(match[1])) return;

      link.addEventListener('click', e => {
        const tab = match[1];
        const onServicesPage = document.querySelector('.tab-btn[data-tab="' + tab + '"]');

        if (onServicesPage && (href.startsWith('#') || href.includes('services.html'))) {
          if (href.startsWith('#') || href.endsWith('services.html#' + tab) || href.includes('services.html#')) {
            e.preventDefault();
            activateTab(tab);
            history.pushState(null, '', `#${tab}`);
            scrollToTabs();
            closeMobileNav();
          }
        }
      });
    });

    handleServiceHash(true);
    window.addEventListener('hashchange', () => handleServiceHash(true));
  }

  /* ============================================================
     5. CAROUSEL
  ============================================================ */
  function initCarousel() {
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsContainer = document.getElementById('carouselDots');
    const slides = document.querySelectorAll('.testimonial-slide');

    if (!track || slides.length === 0 || !prevBtn || !nextBtn || !dotsContainer) return;

    let currentIndex = 0;
    let autoTimer = null;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    function updateDots() {
      document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    function goTo(index) {
      currentIndex = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    }

    function next() { goTo(currentIndex + 1); }
    function prev() { goTo(currentIndex - 1); }
    function startAuto() { autoTimer = setInterval(next, 5000); }
    function stopAuto() { clearInterval(autoTimer); }

    prevBtn.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });
    nextBtn.addEventListener('click', () => { stopAuto(); next(); startAuto(); });

    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { stopAuto(); diff > 0 ? next() : prev(); startAuto(); }
    });

    startAuto();
  }

  /* ============================================================
     6. CONTACT FORM
  ============================================================ */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const fields = {
      firstName: { el: document.getElementById('firstName'), errEl: document.getElementById('firstNameError'), validate: v => v.trim().length >= 2 ? '' : 'Please enter your first name' },
      lastName: { el: document.getElementById('lastName'), errEl: document.getElementById('lastNameError'), validate: v => v.trim().length >= 2 ? '' : 'Please enter your last name' },
      email: { el: document.getElementById('email'), errEl: document.getElementById('emailError'), validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Please enter a valid email address' },
      company: { el: document.getElementById('company'), errEl: document.getElementById('companyError'), validate: v => v.trim().length >= 2 ? '' : 'Please enter your company name' },
      message: { el: document.getElementById('message'), errEl: document.getElementById('messageError'), validate: v => v.trim().length >= 20 ? '' : 'Message must be at least 20 characters' },
    };

    function validateField(key) {
      const f = fields[key];
      if (!f.el || !f.errEl) return true;
      const error = f.validate(f.el.value);
      f.errEl.textContent = error;
      f.el.classList.toggle('error', !!error);
      return !error;
    }

    Object.keys(fields).forEach(key => {
      if (!fields[key].el) return;
      fields[key].el.addEventListener('blur', () => validateField(key));
      fields[key].el.addEventListener('input', () => {
        if (fields[key].el.classList.contains('error')) validateField(key);
      });
    });

    const submitBtn = document.getElementById('formSubmitBtn');
    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const allValid = Object.keys(fields).map(validateField).every(Boolean);
      if (!allValid) return;

      const phone = document.getElementById('phone')?.value || '';
      const service = document.getElementById('service')?.value || '';
      const payload = {
        firstName: fields.firstName.el.value.trim(),
        lastName: fields.lastName.el.value.trim(),
        email: fields.email.el.value.trim(),
        company: fields.company.el.value.trim(),
        phone,
        service,
        message: fields.message.el.value.trim(),
        _subject: 'New inquiry from Zepfter website',
        _template: 'table',
        _captcha: 'false',
      };

      submitBtn.disabled = true;
      submitBtn.querySelector('.btn-text').hidden = true;
      submitBtn.querySelector('.btn-loading').hidden = false;
      if (formError) formError.hidden = true;

      const endpoint = window.ZEPFTER_CONFIG?.formEndpoint || 'https://formsubmit.co/ajax/info@zepfter.com';

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error('Submit failed');

        const submissions = JSON.parse(localStorage.getItem('zepfter_submissions') || '[]');
        submissions.push({ ...payload, date: new Date().toISOString() });
        localStorage.setItem('zepfter_submissions', JSON.stringify(submissions));

        submitBtn.hidden = true;
        formSuccess.hidden = false;
        form.reset();
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').hidden = false;
        submitBtn.querySelector('.btn-loading').hidden = true;
        if (formError) {
          formError.hidden = false;
          formError.textContent = 'Unable to send right now. Please email info@zepfter.com directly.';
        }
      }
    });
  }

  /* ============================================================
     7. NEWSLETTER
  ============================================================ */
  function initNewsletter() {
    document.querySelectorAll('.newsletter-form').forEach(form => {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        const btn = form.querySelector('button');
        if (!input || !input.value.trim()) return;

        const subs = JSON.parse(localStorage.getItem('zepfter_newsletter') || '[]');
        subs.push({ email: input.value.trim(), date: new Date().toISOString() });
        localStorage.setItem('zepfter_newsletter', JSON.stringify(subs));

        input.value = '';
        if (btn) {
          const orig = btn.innerHTML;
          btn.innerHTML = '<i class="ri-check-line"></i> Subscribed!';
          btn.disabled = true;
          setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; }, 3000);
        }
      });
    });
  }

  /* ============================================================
     8. INSIGHTS FILTER
  ============================================================ */
  function initInsightFilter() {
    const filterBar = document.querySelector('.filter-bar');
    if (!filterBar) return;

    const cards = document.querySelectorAll('.insight-article-card, .featured-insight');
    const btns = filterBar.querySelectorAll('.filter-btn');

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.textContent.trim();

        cards.forEach(card => {
          if (filter === 'All') {
            card.style.display = '';
            return;
          }
          const cat = card.querySelector('.insight-category')?.textContent.trim() || '';
          card.style.display = cat === filter ? '' : 'none';
        });
      });
    });
  }

  /* ============================================================
     9. BACK TO TOP
  ============================================================ */
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================================
     10. PARTICLES
  ============================================================ */
  function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const NUM_PARTICLES = Math.min(60, Math.floor(W / 22));
    let particles = [];
    let mouse = { x: W / 2, y: H / 2 };

    document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });

    function createParticles() {
      particles = [];
      for (let i = 0; i < NUM_PARTICLES; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          r: Math.random() * 2 + 1,
          alpha: Math.random() * 0.5 + 0.2,
        });
      }
    }

    window.addEventListener('resize', () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
      createParticles();
    }, { passive: true });

    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i], p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(37, 99, 235, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
        const mdist = Math.hypot(particles[i].x - mouse.x, particles[i].y - mouse.y);
        if (mdist < 160) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(14, 165, 233, ${0.2 * (1 - mdist / 160)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(37, 99, 235, ${p.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }

    createParticles();
    draw();
  }

  /* ============================================================
     11. SMOOTH SCROLL
  ============================================================ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        const hash = anchor.getAttribute('href');
        if (hash === '#') return;

        const tabMatch = hash.match(/^#([a-z]+)$/);
        if (tabMatch && SERVICE_TABS.includes(tabMatch[1]) && document.querySelector('.tab-btn')) {
          return;
        }

        const target = document.querySelector(hash);
        if (target) {
          e.preventDefault();
          const navH = document.getElementById('navbar')?.offsetHeight || 72;
          const top = target.getBoundingClientRect().top + window.scrollY - navH;
          window.scrollTo({ top, behavior: 'smooth' });
          closeMobileNav();
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initAOS();
    initCounters();
    initTabSystem();
    initCarousel();
    initContactForm();
    initNewsletter();
    initInsightFilter();
    initBackToTop();
    initParticles();
    initSmoothScroll();
  });
})();
