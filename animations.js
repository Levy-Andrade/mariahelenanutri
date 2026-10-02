/* Animações & interações extras (Vanilla JS) */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Barra de progresso de rolagem + parallax da foto do hero
  const bar = document.getElementById('scrollProgress');
  const heroPhoto = document.getElementById('heroPhoto');
  addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.width = (scrollY / max * 100) + '%';
    if (heroPhoto && !reduce && scrollY < innerHeight) heroPhoto.style.transform = `translateY(${scrollY * 0.12}px)`;
  }, { passive: true });

  // 2. Fundo animado: folhas/partículas flutuantes em canvas
  const cv = document.getElementById('bgCanvas');
  if (cv && !reduce) {
    const ctx = cv.getContext('2d');
    let W, H, pts = [];
    const mouse = { x: -999, y: -999 };
    const resize = () => {
      W = cv.width = innerWidth; H = cv.height = innerHeight;
      pts = Array.from({ length: Math.min(46, Math.floor(W / 30)) }, () => ({
        x: Math.random() * W, y: Math.random() * H, r: 3 + Math.random() * 7,
        vx: (Math.random() - .5) * .3, vy: -.15 - Math.random() * .35,
        a: Math.random() * 6.28, va: (Math.random() - .5) * .01, o: .25 + Math.random() * .4
      }));
    };
    resize(); addEventListener('resize', resize);
    addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    (function loop() {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
        if (d < 110) { p.x += dx / d * 1.6; p.y += dy / d * 1.6; }   // afasta do mouse
        p.x += p.vx + Math.sin(p.a) * .3; p.y += p.vy; p.a += p.va * 3;
        if (p.y < -20) { p.y = H + 20; p.x = Math.random() * W; }
        if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a);
        ctx.globalAlpha = p.o; ctx.fillStyle = '#69937E';
        ctx.beginPath(); // formato de folha
        ctx.moveTo(0, -p.r); ctx.quadraticCurveTo(p.r, 0, 0, p.r); ctx.quadraticCurveTo(-p.r, 0, 0, -p.r);
        ctx.fill(); ctx.restore();
      });
      requestAnimationFrame(loop);
    })();
  }

  // 3. EVOLUIR: acordeão horizontal com autoplay
  const grid = document.querySelector('.evoluir-grid');
  if (grid) {
    const cards = [...grid.querySelectorAll('.evoluir-card')];
    const desktop = matchMedia('(min-width: 1025px)');
    const prog = document.createElement('div');
    prog.className = 'evoluir-progress'; prog.innerHTML = '<span></span>';
    grid.after(prog);
    const fill = prog.firstChild;
    let cur = 0, timer, paused = false, t0 = 0;
    const DUR = 4000;
    const activate = i => { cur = i; cards.forEach((c, k) => c.classList.toggle('is-active', k === i)); t0 = performance.now(); };
    cards.forEach((c, i) => {
      c.tabIndex = 0;
      c.addEventListener('mouseenter', () => { if (desktop.matches) { activate(i); paused = true; } });
      c.addEventListener('click', () => activate(i));
      c.addEventListener('focus', () => activate(i));
    });
    grid.addEventListener('mouseleave', () => { paused = false; t0 = performance.now(); });
    activate(0);
    (function tick(now) {
      if (desktop.matches && !reduce) {
        if (paused) t0 = now;
        const p = Math.min((now - t0) / DUR, 1);
        fill.style.width = (paused ? 100 : p * 100) + '%';
        if (p >= 1) activate((cur + 1) % cards.length);
      }
      requestAnimationFrame(tick);
    })(performance.now());
  }

  // 4. Contadores animados
  const counters = document.querySelectorAll('[data-count]');
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    const el = e.target, end = parseFloat(el.dataset.count), dec = +el.dataset.decimals || 0;
    const pre = el.dataset.prefix || '', suf = el.dataset.suffix || '', t0 = performance.now(), D = 1600;
    (function step(n) {
      const k = Math.min((n - t0) / D, 1), v = end * (1 - Math.pow(1 - k, 3));
      el.textContent = pre + (dec ? v.toFixed(dec) : Math.round(v).toLocaleString('pt-BR')) + suf;
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }), { threshold: .5 });
  counters.forEach(c => io.observe(c));

  // 5. Filtro da galeria de resultados
  const btns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.result-card');
  btns.forEach(b => b.addEventListener('click', () => {
    btns.forEach(x => x.classList.remove('active')); b.classList.add('active');
    const f = b.dataset.filter;
    items.forEach(it => {
      const show = f === 'all' || it.dataset.cat === f;
      it.style.opacity = '0'; it.style.transform = 'scale(.92)';
      setTimeout(() => { it.classList.toggle('is-hidden', !show); requestAnimationFrame(() => { it.style.opacity = '1'; it.style.transform = ''; }); }, 250);
    });
  }));

  // 6. Tilt 3D nos cards + efeito magnético nos botões grandes
  if (!reduce && matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.service-card, .stat-box').forEach(c => {
      c.classList.add('tilt');
      c.addEventListener('mousemove', e => {
        const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        c.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
      });
      c.addEventListener('mouseleave', () => c.style.transform = '');
    });
    document.querySelectorAll('.btn-lg').forEach(b => {
      b.addEventListener('mousemove', e => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .15}px, ${(e.clientY - r.top - r.height / 2) * .25}px)`;
      });
      b.addEventListener('mouseleave', () => b.style.transform = '');
    });
  }
});
