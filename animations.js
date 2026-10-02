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

  // 2. Fundo animado: folhas coloridas caindo (com nervura, giro e balanço)
  const cv = document.getElementById('bgCanvas');
  if (cv && !reduce) {
    const ctx = cv.getContext('2d');
    const COLORS = ['#3F7A5A', '#69937E', '#8BC34A', '#4DB6AC', '#A5D6A7', '#E0A93B', '#E58A4B', '#2E7D5B'];
    let W, H, pts = [];
    const mouse = { x: -999, y: -999 };
    const mk = (top) => ({
      x: Math.random() * W, y: top ? -30 : Math.random() * H,
      r: 7 + Math.random() * 14, vy: .35 + Math.random() * .9, vx: (Math.random() - .5) * .4,
      a: Math.random() * 6.28, va: (Math.random() - .5) * .03, ph: Math.random() * 6.28, sw: .4 + Math.random() * .9,
      o: .45 + Math.random() * .45, c: COLORS[Math.floor(Math.random() * COLORS.length)]
    });
    const resize = () => {
      W = cv.width = innerWidth; H = cv.height = innerHeight;
      pts = Array.from({ length: Math.min(70, Math.floor(W / 18)) }, () => mk(false));
    };
    resize(); addEventListener('resize', resize);
    addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    (function loop(t) {
      ctx.clearRect(0, 0, W, H);
      pts.forEach((p, i) => {
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
        if (d < 120) { p.x += dx / d * 2.2; p.y += dy / d * 2.2; }
        p.ph += .012; p.x += p.vx + Math.sin(p.ph) * p.sw; p.y += p.vy; p.a += p.va;
        if (p.y > H + 30 || p.x < -40 || p.x > W + 40) pts[i] = mk(true);
        const s = 1 + Math.sin(p.ph * 2) * .18;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.scale(s, 1);
        ctx.globalAlpha = p.o; ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.moveTo(0, -p.r);
        ctx.quadraticCurveTo(p.r * .9, -p.r * .2, 0, p.r); ctx.quadraticCurveTo(-p.r * .9, -p.r * .2, 0, -p.r); ctx.fill();
        ctx.globalAlpha = p.o * .6; ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 1; // nervura
        ctx.beginPath(); ctx.moveTo(0, -p.r * .8); ctx.lineTo(0, p.r * .9); ctx.stroke();
        ctx.restore();
      });
      requestAnimationFrame(loop);
    })();
  }

  // 3. EVOLUIR: clique fixa o pilar (sem hover). Autoplay só até o primeiro clique.
  const grid = document.querySelector('.evoluir-grid');
  if (grid) {
    const cards = [...grid.querySelectorAll('.evoluir-card')];
    const desktop = matchMedia('(min-width: 1025px)');
    const hint = document.createElement('p');
    hint.className = 'evoluir-hint';
    hint.innerHTML = 'Clique em uma <b>letra</b> para fixar o pilar que deseja ler.';
    grid.after(hint);
    let cur = 0, pinned = false, timer;
    const activate = i => { cur = i; cards.forEach((c, k) => { c.classList.toggle('is-active', k === i); c.setAttribute('aria-expanded', k === i); }); };
    const pin = i => { pinned = true; clearInterval(timer); activate(i); };
    cards.forEach((c, i) => {
      c.tabIndex = 0; c.setAttribute('role', 'button');
      c.addEventListener('click', () => pin(i));
      c.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pin(i); } });
    });
    activate(0);
    if (!reduce) timer = setInterval(() => { if (desktop.matches && !pinned) activate((cur + 1) % cards.length); }, 4000);
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
