/* =========================================================
   Lykim Meng — Portfolio v2  |  script.js
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  const prefersNoMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Theme toggle ──────────────────────────────────────── */
  const html = document.documentElement;
  const themeBtn = document.getElementById('themeBtn');

  const saved = localStorage.getItem('lm-theme') || 'dark';
  html.setAttribute('data-theme', saved);

  themeBtn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('lm-theme', next);
  });

  /* ── Sticky nav & back-to-top ──────────────────────────── */
  const nav = document.getElementById('nav');
  const btt = document.getElementById('btt');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('stuck', window.scrollY > 20);
    btt.classList.toggle('show', window.scrollY > 500);
  }, { passive: true });

  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ── Active nav link on scroll ─────────────────────────── */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nl');

  const linkObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.toggle('on', l.getAttribute('href') === `#${e.target.id}`));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => linkObs.observe(s));

  /* ── Mobile drawer ─────────────────────────────────────── */
  const burger = document.getElementById('burger');
  const drawer = document.getElementById('drawer');
  const drawerClose = document.getElementById('drawerClose');
  const overlay = document.getElementById('drawerOverlay');

  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('show');
    burger.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('show');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', () => drawer.classList.contains('open') ? closeDrawer() : openDrawer());
  drawerClose.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);
  document.querySelectorAll('.dl').forEach(l => l.addEventListener('click', closeDrawer));

  /* ── Typing animation ──────────────────────────────────── */
  const typedEl = document.getElementById('typed');
  const phrases = [
    'Software Engineering Student',
    'Aspiring Full-Stack Developer',
    'Python & C# Developer',
    'UI/UX Enthusiast',
    'Problem Solver'
  ];

  if (prefersNoMotion) {
    typedEl.textContent = phrases[0];
  } else {
    let pIdx = 0, cIdx = 0, deleting = false;

    function type() {
      const phrase = phrases[pIdx];
      if (!deleting) {
        typedEl.textContent = phrase.slice(0, ++cIdx);
        if (cIdx === phrase.length) { deleting = true; setTimeout(type, 1600); return; }
        setTimeout(type, 60);
      } else {
        typedEl.textContent = phrase.slice(0, --cIdx);
        if (cIdx === 0) {
          deleting = false;
          pIdx = (pIdx + 1) % phrases.length;
          setTimeout(type, 350);
          return;
        }
        setTimeout(type, 32);
      }
    }
    setTimeout(type, 500);
  }

  /* ── Scroll reveal ─────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  const revObs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        // Stagger children inside a group
        const delay = e.target.dataset.delay || 0;
        e.target.style.transitionDelay = delay + 'ms';
        e.target.classList.add('in');
        revObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach((el, i) => {
    // Add gentle stagger for sibling cards
    const parent = el.parentElement;
    const siblings = [...parent.children].filter(c => c.classList.contains('reveal'));
    const idx = siblings.indexOf(el);
    if (siblings.length > 1) el.dataset.delay = idx * 80;
    revObs.observe(el);
  });

  /* ── Skill bars ────────────────────────────────────────── */
  const bars = document.querySelectorAll('.sl-bar');

  bars.forEach(bar => {
    const percent = bar.dataset.p;
    bar.style.setProperty('--p', percent + '%');
  });

  const barObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('filled');
        barObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(b => barObs.observe(b));

  /* ── Footer year ───────────────────────────────────────── */
  document.getElementById('yr').textContent = new Date().getFullYear();

});
