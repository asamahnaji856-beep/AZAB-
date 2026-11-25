/* ============================================================
   AZAB — main.js
   جميع تفاعلات الموقع في ملف واحد
   ============================================================ */

/* ============ 1. Preloader ============ */
(function(){
  const pre = document.getElementById('preloader');
  const bar = document.getElementById('preBar');
  const cnt = document.getElementById('preCount');
  let p = 0;
  const iv = setInterval(() => {
    p = Math.min(p + Math.random() * 14 + 4, 100);
    bar.style.width = p + '%';
    cnt.textContent = Math.round(p);
    if (p >= 100){
      clearInterval(iv);
      setTimeout(() => {
        pre.classList.add('done');
        document.body.classList.remove('loading');
        setTimeout(() => pre.remove(), 900);
        setTimeout(() => showToast('👋', 'مرحبًا بك في AZAB!'), 1200);
      }, 300);
    }
  }, 130);
})();

/* ============ 2. الثيم ============ */
const root = document.documentElement;
const themeBtn = document.getElementById('themeBtn');
if (localStorage.getItem('theme')) root.dataset.theme = localStorage.getItem('theme');
themeBtn.textContent = root.dataset.theme === 'dark' ? '🌙' : '☀️';
themeBtn.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  const apply = () => {
    root.dataset.theme = next;
    themeBtn.textContent = next === 'dark' ? '🌙' : '☀️';
    localStorage.setItem('theme', next);
    showToast(next === 'dark' ? '🌙' : '☀️', next === 'dark' ? 'الوضع الليلي مفعّل' : 'الوضع النهاري مفعّل');
  };
  if (document.startViewTransition) document.startViewTransition(apply);
  else apply();
});

/* ============ 3. القائمة ============ */
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', e => {
  e.stopPropagation();
  const open = navLinks.classList.toggle('open');
  burger.textContent = open ? '✕' : '☰';
});
navLinks.addEventListener('click', e => {
  if (e.target.tagName === 'A'){
    navLinks.classList.remove('open');
    burger.textContent = '☰';
  }
});

/* ============ 4. المؤشر + Trail ============ */
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
let mx = innerWidth/2, my = innerHeight/2, rx = mx, ry = my;
let trailThrottle = 0;

addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;

  const now = Date.now();
  if (now - trailThrottle > 40){
    trailThrottle = now;
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.left = mx + 'px';
    trail.style.top = my + 'px';
    document.body.appendChild(trail);
    setTimeout(() => trail.remove(), 800);
  }
});

(function loop(){
  rx += (mx - rx) * 0.15;
  ry += (my - ry) * 0.15;
  ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
  requestAnimationFrame(loop);
})();

const hoverEls = 'a,button,.bento-card,.service-list li,.cmdk-item,.video-wrap,.fact';
function bindHover(){
  document.querySelectorAll(hoverEls).forEach(el => {
    if (el._hoverBound) return;
    el._hoverBound = true;
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
}
bindHover();

/* ============ 5. Hero Glow ============ */
const heroGlow = document.getElementById('heroGlow');
const hero = document.querySelector('.hero');
if (hero && heroGlow){
  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    heroGlow.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    heroGlow.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
}

/* ============ 6. Hero Title Word Reveal ============ */
(function(){
  const title = document.getElementById('heroTitle');
  if (!title) return;
  const lines = [
    'الإبداع الرقمي',
    'يبدأ من هنا'
  ];
  let delay = 0;
  title.innerHTML = lines.map((line, i) => {
    return line.split(' ').map(word => {
      const span = `<span class="word" style="animation-delay:${delay}s">${word}</span>`;
      delay += 0.1;
      return span;
    }).join(' ') + (i < lines.length - 1 ? '<br>' : '');
  }).join('');

  const words = title.querySelectorAll('.word');
  words.forEach((w, i) => {
    if (i >= 2) w.classList.add('grad-text');
  });
})();

/* ============ 7. Scroll (progress + toTop) ============ */
const progressBar = document.getElementById('progressBar');
const toTop = document.getElementById('toTop');
addEventListener('scroll', () => {
  const el = document.documentElement;
  const max = el.scrollHeight - el.clientHeight;
  progressBar.style.width = (max > 0 ? el.scrollTop / max * 100 : 0) + '%';
  toTop.classList.toggle('show', el.scrollTop > 500);
}, { passive: true });
toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

/* ============ 8. Section Nav Dots ============ */
(function(){
  const sections = document.querySelectorAll('section[id]');
  const navDots = document.querySelectorAll('.section-nav a');
  if (!navDots.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        navDots.forEach(d => d.classList.toggle('active', d.dataset.section === entry.target.id));
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => observer.observe(s));
})();

/* ============ 9. Reveal on scroll ============ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting){
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============ 10. Count-up ============ */
const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.dataset.target;
    const suffix = el.dataset.suffix || '';
    const dur = 1800;
    const start = performance.now();
    (function tick(now){
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    })(start);
    countObserver.unobserve(el);
  });
}, { threshold: 0.6 });
document.querySelectorAll('.num').forEach(c => countObserver.observe(c));

/* ============ 11. Typing Effect ============ */
const words = ['مواقع احترافية', 'شبكات مترابطة', 'بنية تحتية قوية', 'حلول رقمية'];
const typedEl = document.getElementById('typed');
let wI = 0, cI = 0, del = false;
(function type(){
  if (!typedEl) return;
  const w = words[wI];
  typedEl.textContent = del ? w.substring(0, --cI) : w.substring(0, ++cI);
  let d = del ? 55 : 105;
  if (!del && cI === w.length){ d = 1700; del = true; }
  else if (del && cI === 0){ del = false; wI = (wI + 1) % words.length; d = 300; }
  setTimeout(type, d);
})();

/* ============ 12. 3D Tilt على بطاقات Bento ============ */
document.querySelectorAll('.bento-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    card.style.setProperty('--mx', x + 'px');
    card.style.setProperty('--my', y + 'px');
    if (card.classList.contains('tilt')){
      const rotX = ((y / r.height) - 0.5) * -8;
      const rotY = ((x / r.width) - 0.5) * 8;
      card.style.transform = `translateY(-6px) perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    }
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ============ 13. Magnetic + Ripple ============ */
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px) translateY(-2px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.add('ripple');
    setTimeout(() => btn.classList.remove('ripple'), 600);
  });
});

/* ============ 14. Toast Notifications ============ */
const toastContainer = document.getElementById('toastContainer');
function showToast(icon, message, duration = 3000){
  if (!toastContainer) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span class="ico">${icon}</span><span>${message}</span>`;
  toastContainer.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, duration);
}
// جعلها متاحة عالميًا (لأنها تُستدعى من أماكن متعددة)
window.showToast = showToast;

/* ============ 15. Command Palette ============ */
const cmdk = document.getElementById('cmdk');
const cmdkInput = document.getElementById('cmdkInput');
const cmdkList = document.getElementById('cmdkList');
const cmdkBtn = document.getElementById('cmdkBtn');
const WA_LINK = 'https://wa.me/967778576860?text=مرحباً%20AZAB%2C%20أريد%20الاستفسار%20عن%20خدماتكم';

const commands = [
  { ico: '🏠', label: 'الرئيسية',         hint: 'Home',     action: () => go('#home') },
  { ico: '🎬', label: 'الفيديو التعريفي',  hint: 'Showcase', action: () => go('#showcase') },
  { ico: '💻', label: 'تطوير الويب',      hint: 'Web',      action: () => go('#web') },
  { ico: '🌐', label: 'ربط الشبكات',      hint: 'Network',  action: () => go('#network') },
  { ico: '📁', label: 'مشاريعنا',          hint: 'Projects', action: () => go('#projects') },
  { ico: '💬', label: 'تواصل عبر واتساب', hint: 'WhatsApp', action: () => window.open(WA_LINK, '_blank') },
  { ico: '✉️', label: 'قسم التواصل',       hint: 'Contact',  action: () => go('#contact') },
  { ico: '🌓', label: 'تبديل الوضع',       hint: 'Theme',    action: () => themeBtn.click() },
  { ico: '⬆️', label: 'العودة للأعلى',     hint: 'Top',      action: () => scrollTo({ top: 0, behavior: 'smooth' }) },
];
let activeIdx = 0;

function go(hash){
  closeCmdk();
  document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
}

function renderCmdk(q = ''){
  const filtered = commands.filter(c =>
    c.label.toLowerCase().includes(q.toLowerCase()) ||
    c.hint.toLowerCase().includes(q.toLowerCase())
  );
  activeIdx = 0;
  if (!filtered.length){
    cmdkList.innerHTML = '<div class="cmdk-empty">لا توجد نتائج مطابقة</div>';
    cmdkList._filtered = [];
    return;
  }
  cmdkList.innerHTML = filtered.map((c, i) => `
    <div class="cmdk-item ${i === 0 ? 'active' : ''}" data-idx="${i}">
      <span class="ico">${c.ico}</span>
      <span>${c.label}</span>
      <span class="hint">${c.hint}</span>
    </div>
  `).join('');
  cmdkList.querySelectorAll('.cmdk-item').forEach((el, i) => {
    el.addEventListener('click', () => filtered[i].action());
    el.addEventListener('mouseenter', () => setActive(i, filtered));
  });
  cmdkList._filtered = filtered;
  bindHover();
}

function setActive(i){
  const items = cmdkList.querySelectorAll('.cmdk-item');
  items.forEach((el, j) => el.classList.toggle('active', j === i));
  activeIdx = i;
}

function openCmdk(){
  cmdk.classList.add('open');
  cmdkInput.value = '';
  renderCmdk('');
  setTimeout(() => cmdkInput.focus(), 50);
}
function closeCmdk(){ cmdk.classList.remove('open'); }

cmdkBtn.addEventListener('click', openCmdk);
cmdk.addEventListener('click', e => { if (e.target === cmdk) closeCmdk(); });
cmdkInput.addEventListener('input', e => renderCmdk(e.target.value));
cmdkInput.addEventListener('keydown', e => {
  const list = cmdkList._filtered || [];
  if (e.key === 'ArrowDown'){
    e.preventDefault();
    setActive((activeIdx + 1) % list.length);
    cmdkList.querySelectorAll('.cmdk-item')[activeIdx]?.scrollIntoView({ block: 'nearest' });
  } else if (e.key === 'ArrowUp'){
    e.preventDefault();
    setActive((activeIdx - 1 + list.length) % list.length);
    cmdkList.querySelectorAll('.cmdk-item')[activeIdx]?.scrollIntoView({ block: 'nearest' });
  } else if (e.key === 'Enter'){
    e.preventDefault();
    list[activeIdx]?.action();
  } else if (e.key === 'Escape'){
    closeCmdk();
  }
});
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'){
    e.preventDefault();
    cmdk.classList.contains('open') ? closeCmdk() : openCmdk();
  }
  if (e.key === 'Escape') closeCmdk();
});

/* ============ 16. Live Clock ============ */
function tickClock(){
  const clock = document.getElementById('clock');
  if (clock) clock.textContent = new Date().toLocaleTimeString('ar-EG', { hour12: false });
}
tickClock();
setInterval(tickClock, 1000);

/* ============ 17. السنة ============ */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ============ 18. الخلفية التفاعلية ============ */
(function networkBg(){
  const canvas = document.getElementById('netCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, dots = [], mouse = { x: -1000, y: -1000 };

  function resize(){
    W = canvas.width = innerWidth;
    H = canvas.height = innerHeight;
    const count = Math.min(70, Math.floor((W * H) / 18000));
    dots = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
      r: Math.random() * 1.6 + .6
    }));
  }
  resize();
  addEventListener('resize', resize);
  addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  addEventListener('mouseout', () => { mouse.x = mouse.y = -1000; });

  function draw(){
    ctx.clearRect(0, 0, W, H);
    const light = document.documentElement.dataset.theme === 'light';
    const dotColor = light ? 'rgba(168,85,247,.5)' : 'rgba(168,85,247,.7)';
    const lineColor = light ? 'rgba(168,85,247,' : 'rgba(168,85,247,';

    for (const d of dots){
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0 || d.x > W) d.vx *= -1;
      if (d.y < 0 || d.y > H) d.vy *= -1;
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = dotColor; ctx.fill();
    }

    for (let i = 0; i < dots.length; i++){
      for (let j = i + 1; j < dots.length; j++){
        const dist = Math.hypot(dots[i].x - dots[j].x, dots[i].y - dots[j].y);
        if (dist < 130){
          const op = (1 - dist / 130) * .35;
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = lineColor + op + ')';
          ctx.lineWidth = .6;
          ctx.stroke();
        }
      }
    }

    for (const d of dots){
      const dist = Math.hypot(d.x - mouse.x, d.y - mouse.y);
      if (dist < 180){
        const op = (1 - dist / 180) * .6;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = light ? `rgba(6,182,212,${op})` : `rgba(163,230,53,${op})`;
        ctx.lineWidth = .8;
        ctx.stroke();
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ============ 19. مشغّل الفيديو ============ */
(function videoPlayer(){
  const wrap = document.getElementById('videoWrap');
  const player = document.getElementById('videoPlayer');
  const closeBtn = document.getElementById('videoClose');
  if (!wrap || !player || !closeBtn) return;

  const videoUrl = wrap.dataset.video;
  const type = wrap.dataset.type || 'youtube';

  function loadVideo(){
    if (type === 'local'){
      player.innerHTML = `
        <video controls autoplay playsinline preload="metadata">
          <source src="${videoUrl}" type="video/mp4">
          متصفحك لا يدعم تشغيل الفيديو.
        </video>
      `;
      const vid = player.querySelector('video');
      vid.addEventListener('error', () => {
        player.innerHTML = `
          <div style="display:grid;place-items:center;height:100%;padding:2rem;text-align:center;color:#fff;font-family:'Cairo',sans-serif;background:#0a1628;">
            <div>
              <div style="font-size:3rem;margin-bottom:1rem;">⚠️</div>
              <h3 style="margin-bottom:.5rem;">الفيديو غير موجود</h3>
              <p style="color:#7c8aa3;font-size:.9rem;">
                تأكد من وجود الملف في: <code style="background:#152a48;padding:.2rem .5rem;border-radius:6px;color:#22d3ee;">${videoUrl}</code>
              </p>
            </div>
          </div>
        `;
      });
      vid.addEventListener('ended', () => {
        showToast('🎬', 'شكرًا لمشاهدة الفيديو التعريفي!');
      });
    } else {
      const sep = videoUrl.includes('?') ? '&' : '?';
      const src = videoUrl + sep + 'autoplay=1&rel=0&modestbranding=1';
      player.innerHTML = `<iframe src="${src}" title="AZAB Company Profile" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
    }
  }

  function playVideo(){
    loadVideo();
    wrap.classList.add('playing');
    showToast('▶️', 'جاري تحميل الفيديو...');
  }

  function closeVideo(){
    wrap.classList.remove('playing');
    player.innerHTML = '';
  }

  wrap.addEventListener('click', () => {
    if (wrap.classList.contains('playing')) return;
    playVideo();
  });
  closeBtn.addEventListener('click', e => {
    e.stopPropagation();
    closeVideo();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && wrap.classList.contains('playing')) closeVideo();
  });
})();