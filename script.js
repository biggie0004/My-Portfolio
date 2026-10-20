/* =========================================================
   Lykim Meng — Portfolio v3  |  script.js  |  3D Neon Dark
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
    // Update canvas colors on theme change
    updateCanvasColors();
  });

  /* ── Cursor spotlight ──────────────────────────────────── */
  const spotlight = document.getElementById('cursorSpotlight');
  if (spotlight && !prefersNoMotion) {
    let spotX = -999, spotY = -999;
    document.addEventListener('mousemove', e => {
      spotX = e.clientX;
      spotY = e.clientY;
      spotlight.style.left = spotX + 'px';
      spotlight.style.top = spotY + 'px';
    }, { passive: true });
    document.addEventListener('mouseleave', () => {
      spotlight.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      spotlight.style.opacity = '1';
    });
  }

  /* ── Sticky nav & back-to-top ──────────────────────────── */
  const nav = document.getElementById('nav');
  const btt = document.getElementById('btt');
  const progress = document.getElementById('scrollProgress');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('stuck', window.scrollY > 20);
    btt.classList.toggle('show', window.scrollY > 500);

    // Scroll progress bar
    if (progress) {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docH > 0 ? (window.scrollY / docH) * 100 : 0;
      progress.style.width = pct + '%';
    }
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
    'Adobe Illustrator Designer',
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
        if (cIdx === phrase.length) { deleting = true; setTimeout(type, 1800); return; }
        setTimeout(type, 60);
      } else {
        typedEl.textContent = phrase.slice(0, --cIdx);
        if (cIdx === 0) {
          deleting = false;
          pIdx = (pIdx + 1) % phrases.length;
          setTimeout(type, 400);
          return;
        }
        setTimeout(type, 30);
      }
    }
    setTimeout(type, 700);
  }

  /* ── Scroll reveal ─────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = e.target.dataset.delay || 0;
        e.target.style.transitionDelay = delay + 'ms';
        e.target.classList.add('in');
        revObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => {
    const parent = el.parentElement;
    const siblings = [...parent.children].filter(c => c.classList.contains('reveal'));
    const idx = siblings.indexOf(el);
    if (siblings.length > 1) el.dataset.delay = idx * 90;
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

  /* ── 3D Tilt on project & skill cards ─────────────────── */
  if (!prefersNoMotion) {
    const tiltTargets = document.querySelectorAll('.pcard, .skill-col, .about-photo-card, .exp-card, .edu-card');

    tiltTargets.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotX = ((y - cy) / cy) * -7;
        const rotY = ((x - cx) / cx) * 7;

        card.style.transform = `perspective(1100px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(10px) scale(1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s cubic-bezier(.34,1.56,.64,1)';
        setTimeout(() => { card.style.transition = ''; }, 500);
      });
    });
  }

  /* ── Project Filters ───────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const pcards = document.querySelectorAll('.pcard');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      pcards.forEach(card => {
        const cat = card.dataset.category;
        const show = filter === 'all' || cat === filter;

        if (show) {
          card.style.display = 'flex';
          // Trigger reflow for animation
          void card.offsetWidth;
          card.style.opacity = '1';
          card.style.transform = '';
          card.style.pointerEvents = 'auto';
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.92) translateY(20px)';
          card.style.pointerEvents = 'none';
          setTimeout(() => {
            if (btn.dataset.filter !== 'all' && card.dataset.category !== btn.dataset.filter) {
              card.style.display = 'none';
            }
          }, 350);
        }
      });
    });
  });

  /* ── Particle Canvas Background ─────────────────────────── */
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || prefersNoMotion) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  let isDark = html.getAttribute('data-theme') !== 'light';

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Color config
  const COLORS_DARK = [
    'rgba(124,58,237,',   // purple
    'rgba(6,182,212,',    // cyan
    'rgba(168,85,247,',   // light purple
    'rgba(236,72,153,',   // pink
    'rgba(16,185,129,',   // green
  ];
  const COLORS_LIGHT = [
    'rgba(124,58,237,',
    'rgba(6,182,212,',
    'rgba(168,85,247,',
  ];

  let COLORS = isDark ? COLORS_DARK : COLORS_LIGHT;

  function updateCanvasColors() {
    isDark = html.getAttribute('data-theme') !== 'light';
    COLORS = isDark ? COLORS_DARK : COLORS_LIGHT;
  }
  window.updateCanvasColors = updateCanvasColors;

  class Particle {
    constructor() { this.reset(true); }

    reset(init = false) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 20;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = -(Math.random() * 0.5 + 0.2);
      this.size = Math.random() * 2.5 + 0.5;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha = 0;
      this.maxAlpha = Math.random() * 0.6 + 0.1;
      this.fadeIn = true;
      this.life = 0;
      this.maxLife = Math.random() * 300 + 200;
      // Connection strength
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
    }

    update() {
      this.life++;
      this.pulse += this.pulseSpeed;
      this.x += this.vx;
      this.y += this.vy;

      if (this.life < 60) {
        this.alpha = (this.life / 60) * this.maxAlpha;
      } else if (this.life > this.maxLife - 60) {
        this.alpha = ((this.maxLife - this.life) / 60) * this.maxAlpha;
      }

      if (this.life >= this.maxLife || this.y < -20) {
        this.reset();
      }
    }

    draw() {
      const pulsedAlpha = this.alpha * (0.7 + 0.3 * Math.sin(this.pulse));
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + pulsedAlpha + ')';
      ctx.fill();

      // Glow
      if (this.size > 1.5) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
        grad.addColorStop(0, this.color + (pulsedAlpha * 0.3) + ')');
        grad.addColorStop(1, this.color + '0)');
        ctx.fillStyle = grad;
        ctx.fill();
      }
    }
  }

  // Init particles
  const COUNT = Math.min(80, Math.floor(W * H / 12000));
  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  // Draw connections between nearby particles
  function drawConnections() {
    const maxDist = 130;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.12 * particles[i].alpha * particles[j].alpha * 8;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124,58,237,${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  // Mouse interaction
  let mouse = { x: -999, y: -999 };
  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  function drawMouseGlow() {
    if (mouse.x < 0) return;
    const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 200);
    grad.addColorStop(0, 'rgba(124,58,237,0.04)');
    grad.addColorStop(1, 'rgba(124,58,237,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  // Animate
  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawMouseGlow();
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();

});
