// =====================
// Language switch (IT / EN)
// =====================
const i18nEls = document.querySelectorAll('[data-en]');
// cache the original Italian content on first load
i18nEls.forEach(el => {
  el.dataset.itCache = el.dataset.html === 'true' ? el.innerHTML : el.textContent;
});
const langButtons = document.querySelectorAll('.lang-btn');

function setLang(lang) {
  i18nEls.forEach(el => {
    const value = lang === 'en' ? el.dataset.en : el.dataset.itCache;
    if (el.dataset.html === 'true') el.innerHTML = value;
    else el.textContent = value;
  });
  document.documentElement.lang = lang;
  document.title = lang === 'en'
    ? "Contemplia — Automate the routine. Elevate the human."
    : "Contemplia — Automatizza la routine. Eleva l'umano.";
  langButtons.forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  try { localStorage.setItem('contemplia_lang', lang); } catch (e) {}
}

langButtons.forEach(btn => {
  btn.addEventListener('click', () => setLang(btn.dataset.lang));
});

let savedLang = null;
try { savedLang = localStorage.getItem('contemplia_lang'); } catch (e) {}
const urlLang = new URLSearchParams(window.location.search).get('lang');
const initialLang = (urlLang === 'en' || urlLang === 'it') ? urlLang : savedLang;
if (initialLang === 'en') setLang('en');

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Mobile menu
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// Reveal on scroll
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

reveals.forEach(el => revealObserver.observe(el));

// Stat counter animation
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    el.textContent = Math.round(easeOut(progress) * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const statNumbers = document.querySelectorAll('.stat-number');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => statObserver.observe(el));

// Use case cards — toggle open/close
document.querySelectorAll('.usecase-card').forEach(card => {
  card.addEventListener('click', (e) => {
    // Don't close when clicking the close button (handled separately)
    if (e.target.classList.contains('detail-close')) return;
    if (!card.classList.contains('open')) {
      card.classList.add('open');
    }
  });
});

document.querySelectorAll('.detail-close').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    btn.closest('.usecase-card').classList.remove('open');
  });
});

// Smooth active nav link highlight
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.style.color = 'var(--text)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));
